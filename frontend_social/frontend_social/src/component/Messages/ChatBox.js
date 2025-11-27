// src/components/chat/ChatBox.jsx
import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import timeAgo from '../../Ago';
import { useAuth } from '../../context/AuthContext';
import { getAllMessage } from '../../apis/ChatService';
import { API_URL } from '../../constants/apiConstants';
import { toast } from 'react-toastify';
import './ChatBox.css';

function ChatBox({ user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const prevScrollHeightRef = useRef(0);
  const stompClient = useRef(null);

  const { token, user: currentUser } = useAuth();
  const cleanToken = token?.startsWith('Bearer ') ? token.replace('Bearer ', '') : token;

  const PAGE_SIZE = 20;

  // TẢI TIN NHẮN – BACKEND ĐÃ TRẢ ĐÚNG THỨ TỰ → DÙNG NGUYÊN
  const loadMoreMessages = async (pageNum) => {
    if (!hasMore || loading || !cleanToken || !user?.chatId) return;
    setLoading(true);

    try {
      const res = await getAllMessage(user.chatId, pageNum, PAGE_SIZE, cleanToken);
      const newMsgs = res.data?.content || [];

      if (newMsgs.length < PAGE_SIZE) setHasMore(false);

      setMessages(prev => {
        // Không reverse gì cả → backend đã đúng thứ tự
        const combined = pageNum === 0 ? [...newMsgs] : [...newMsgs, ...prev];

        // Loại trùng (chỉ khi load thêm)
        if (pageNum === 0) return combined;
        const existingIds = new Set(prev.map(m => m.id));
        return combined.filter(msg => !existingIds.has(msg.id));
      });

      // Giữ vị trí scroll khi load thêm tin cũ
      if (pageNum > 0 && containerRef.current) {
        setTimeout(() => {
          const el = containerRef.current;
          el.scrollTop = el.scrollHeight - prevScrollHeightRef.current;
        }, 0);
      }
    } catch (err) {
      console.error('Lỗi tải tin nhắn:', err);
      toast.error('Không thể tải tin nhắn cũ');
    } finally {
      setLoading(false);
    }
  };

  // WEBSOCKET – NHẬN TIN MỚI → THÊM VÀO CUỐI
  useEffect(() => {
    if (!cleanToken || !user?.chatId || !currentUser?.username) return;

    const socket = new SockJS(`${API_URL.replace('/api', '')}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${cleanToken}` },
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('WebSocket kết nối thành công');

        client.subscribe(`/topic/chat/${user.chatId}`, message => {
          const incoming = JSON.parse(message.body);

          setMessages(prev => {
            if (prev.some(m => m.id === incoming.id)) return prev;
            return [incoming, ...prev]; // ← THÊM VÀO CUỐI → HIỆN DƯỚI CÙNG
          });
        });
      },
    });

    client.activate();
    stompClient.current = client;

    return () => client.deactivate();
  }, [user?.chatId, cleanToken, currentUser?.username]);

  // LOAD LẦN ĐẦU
  useEffect(() => {
    setMessages([]);
    setPage(0);
    setHasMore(true);
    loadMoreMessages(0);
  }, [user?.chatId]);

  // TỰ ĐỘNG SCROLL XUỐNG DƯỚI KHI CÓ TIN MỚI
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // LƯU CHIỀU CAO KHI LOAD THÊM
  useEffect(() => {
    if (loading && containerRef.current) {
      prevScrollHeightRef.current = containerRef.current.scrollHeight;
    }
  }, [loading]);

  // CUỘN LÊN → LOAD THÊM
  const handleScroll = () => {
    const el = containerRef.current;
    if (el && el.scrollTop < 150 && hasMore && !loading) {
      setPage(p => p + 1);
      loadMoreMessages(page + 1);
    }
  };

  // GỬI TIN NHẮN
  const sendMessage = () => {
    if (!newMessage.trim() || !stompClient.current?.connected) return;

    const payload = {
      content: newMessage.trim(),
      senderUsername: currentUser.username,
      receiverUsername: user.username
    };

    stompClient.current.publish({
      destination: `/app/chat/${user.chatId}/sendMessage`,
      body: JSON.stringify(payload)
    });

    setNewMessage('');
  };

  return (
    <div className="chatbox-modal">
      <div className="chatbox-header">
        <div className="chatbox-user-info">
          <div className="avatar">{user.username[0].toUpperCase()}</div>
          <h3>{user.username}</h3>
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="chatbox-messages" ref={containerRef} onScroll={handleScroll}>
        {loading && page > 0 && <div className="loading-more">Đang tải tin nhắn cũ...</div>}

        {messages.length === 0 && !loading && (
          <div className="no-messages">Chưa có tin nhắn nào. Hãy bắt đầu!</div>
        )}

        {messages.map(msg => {
          const isSent = msg.senderUsername === currentUser?.username;

          return (
            <div key={msg.id} className={`message ${isSent ? 'sent' : 'received'}`}>
              <div className="message-content">
                <p>{msg.content}</p>
                <span className="timestamp">{timeAgo(msg.timestamp)}</span>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="chatbox-input">
        <input
          type="text"
          placeholder={stompClient.current?.connected ? "Nhập tin nhắn..." : "Đang kết nối..."}
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={!stompClient.current?.connected}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim() || !stompClient.current?.connected}
          className="send-btn"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
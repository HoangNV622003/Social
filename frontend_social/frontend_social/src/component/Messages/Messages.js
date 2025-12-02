// src/pages/message/Messages.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import ChatBox from './ChatBox';
import FriendSearchBar from '../FriendSearchBar/FriendSearchBar';
import UserAvatar from '../UserAvatar/UserAvatar';
import ConversationItem from '../ConservationItem/ConservationItem'; // ĐÃ TÍCH HỢP
import timeAgo from '../../Ago';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getAllChats, deleteChat } from '../../apis/ChatService';
import './Messages.css';

// Icons
const BackIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const EmptyIcon = () => (
  <svg viewBox="0 0 24 24" width="90" height="90" fill="#9ca3af">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  </svg>
);

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  const { token } = useAuth();

  // Responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lấy danh sách cuộc trò chuyện
  const fetchConversations = async () => {
    if (!token) {
      setError('Bạn chưa đăng nhập');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await getAllChats(token);
      console.log("Fetched conversations:", response.data);
      const sorted = (response.data || []).sort(
        (a, b) => new Date(b.lastMessageTimestamp || 0) - new Date(a.lastMessageTimestamp || 0)
      );
      setConversations(sorted);
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể tải tin nhắn';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [token]);

  // Xóa cuộc trò chuyện
  const deleteConversation = async (chatId) => {
    if (!window.confirm('Xóa toàn bộ cuộc trò chuyện này?')) return;
    try {
      await deleteChat(chatId, token);
      toast.success('Đã xóa cuộc trò chuyện');
      setConversations(prev => prev.filter(c => c.chatId !== chatId));
      if (selectedChat?.chatId === chatId) setSelectedChat(null);
    } catch (err) {
      toast.error('Xóa thất bại');
    }
  };

  // Mở chat với bạn bè (từ kết quả tìm kiếm)
  const openChatWithFriend = (friend) => {
    const existing = conversations.find(c => c.username === friend.username);
    if (existing) {
      setSelectedChat(existing);
    } else {
      setSelectedChat({
        username: friend.username,
        image: friend.image || null,
        chatId: null,
        unreadCount: 0,
        lastMessageContent: '',
        lastMessageTimestamp: null
      });
    }
  };

  return (
    <div className="messages-app">
      <Navbar />

      <div className="messages-layout">
        {/* SIDEBAR */}
        <aside className={`messages-sidebar ${selectedChat && isMobile ? 'hide' : 'show'}`}>
          <div className="sidebar-header">
            <h1>Tin nhắn</h1>
            <FriendSearchBar onSelectFriend={openChatWithFriend} />
          </div>

          {/* Loading / Error / Empty */}
          {loading && (
            <div className="loading text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          )}

          {error && <div className="error text-center py-5 text-danger">{error}</div>}

          {!loading && !error && conversations.length === 0 && (
            <div className="empty-conversations">
              <EmptyIcon />
              <h3>Chưa có tin nhắn nào</h3>
              <p>Hãy tìm bạn bè và bắt đầu trò chuyện!</p>
            </div>
          )}

          {/* DANH SÁCH CUỘC TRÒ CHUYỆN – ĐÃ DÙNG COMPONENT CON */}
          <div className="conversations-scroll">
            {conversations.map(conv => (
              <ConversationItem
                key={conv.chatId}
                conversation={conv}
                isActive={selectedChat?.chatId === conv.chatId}
                onSelect={setSelectedChat}
                onDelete={deleteConversation}
              />
            ))}
          </div>
        </aside>

        {/* CHAT AREA */}
        <main className={`chat-area ${!selectedChat && isMobile ? 'hide' : 'show'}`}>
          {selectedChat ? (
            <>
              {isMobile && (
                <div className="mobile-chat-header">
                  <button onClick={() => setSelectedChat(null)} className="back-button">
                    <BackIcon />
                  </button>
                  <UserAvatar username={selectedChat.username} image={selectedChat.image} size="small" />
                  <h3>{selectedChat.username}</h3>
                </div>
              )}
              <ChatBox user={selectedChat} onClose={() => setSelectedChat(null)} />
            </>
          ) : (
            <div className="no-selection">
              <EmptyIcon />
              <h2>Chọn một cuộc trò chuyện</h2>
              <p>Hoặc tìm kiếm bạn bè để bắt đầu nhắn tin</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Messages;
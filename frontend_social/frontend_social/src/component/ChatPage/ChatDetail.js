// src/components/chat/ChatDetail.jsx
import React, { useState, useEffect, useRef, memo } from 'react';
import { useMessageWebSocket } from '../../hooks/useMessageWebSocket';
import MessageList from './MessageList';
import UserAvatar from '../UserAvatar/UserAvatar';
import { AiOutlineSend } from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';
import { getChatDetail } from '../../apis/ChatService';
import { getChatDisplayInfo } from '../../utils/CommonUtils';
import './ChatDetail.css';

const ChatDetail = ({ chat, currentUserId }) => {
    const { token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [opponent, setOpponent] = useState({ displayName: 'Đ127', displayImage: null });

    const messagesEndRef = useRef(null);

    // WebSocket: nhận tin mới → thêm vào cuối (tin mới ở dưới)
    const { sendMessage } = useMessageWebSocket(chat?.id, (newMessage) => {
        setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
        });
    });

    // Load tin nhắn + thông tin người chat (từ API chi tiết → chính xác 100%)
    useEffect(() => {
        if (!chat?.id || !token) return;

        const load = async () => {
            setLoading(true);
            try {
                const res = await getChatDetail(chat.id, 0, 30, token);

                // Load tin nhắn: backend trả mới → cũ → reverse lại → cũ ở trên, mới ở dưới
                const rawMsgs = res.data.messages?.content || [];
                const msgs = rawMsgs.slice().reverse();
                setMessages(msgs);

                // Load tên + ảnh từ API chi tiết (luôn chính xác)
                const info = getChatDisplayInfo(res.data, currentUserId);
                setOpponent({
                    displayName: info.displayName,
                    displayImage: info.displayImage
                });

            } catch (err) {
                console.error('Load chat detail error:', err);
                setOpponent({ displayName: 'Lỗi tải thông tin', displayImage: null });
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [chat?.id, token, currentUserId]);

    // Auto scroll xuống tin mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        sendMessage({
            content: input.trim(),
            senderId: currentUserId
        });

        setInput('');
    };

    if (!chat) return <div className="empty">Chọn cuộc trò chuyện</div>;

    return (

        <div className="chat-detail">
            {/* HEADER – luôn có tên + ảnh ngay khi load xong */}
            <div className="chat-detail-header">
                <UserAvatar
                    username={opponent.displayName}
                    image={opponent.displayImage}
                    size="medium"
                    fallback={opponent.displayName?.[0]?.toUpperCase() || '?'}
                />
                <h2>{opponent.displayName}</h2>
            </div>

            {/* TIN NHẮN */}
            <div className="chat-messages-container">
                {loading && <div className="loading">Đang tải tin nhắn...</div>}

                <MessageList
                    messages={messages}
                    currentUserId={currentUserId}
                    chatType={chat.type}
                    opponent={opponent}
                />

                <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="chat-input-area">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder="Nhập tin nhắn..."
                    autoFocus
                />
                <button onClick={handleSend} disabled={!input.trim()}>
                    <AiOutlineSend />
                </button>
            </div>
        </div>
    );
};

export default memo(ChatDetail);
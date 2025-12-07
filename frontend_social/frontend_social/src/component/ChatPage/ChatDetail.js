// src/components/chat/ChatDetail.jsx
import React, { useState, useEffect, useRef, memo } from 'react';
import { useMessageWebSocket } from '../../hooks/useMessageWebSocket';
import { useChatDetail } from '../../hooks/Chat/useChatDetail';
import MessageList from './MessageList';
import ChatDetailHeader from './ChatDetailHeader';
import GroupUpdatePopup from '../Popup/CreateGroupPopup/GroupUpdatePopup';
import { AiOutlineSend } from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';
import { useUnreadChatCount, useUpdatedChats } from '../../context/ChatRealtimeContext';
import './ChatDetail.css';

const ChatDetail = ({ chat, currentUserId }) => {
    const { token } = useAuth();
    const { resetUnreadCount } = useUnreadChatCount();

    // THÊM: Lắng nghe cập nhật nhóm realtime
    const { updatedChats, markChatAsUpdated } = useUpdatedChats();

    // State quản lý tin nhắn + input
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [showGroupUpdate, setShowGroupUpdate] = useState(false);
    const messagesEndRef = useRef(null);

    // Dữ liệu chat hiện tại (có thể bị cập nhật realtime)
    const [currentChatData, setCurrentChatData] = useState(chat);

    // Lấy chi tiết chat ban đầu từ API (chỉ gọi 1 lần)
    const { fullChatData, opponent, loading, reload } = useChatDetail(
        chat?.id,
        token,
        currentUserId
    );

    // Khi load lần đầu → set dữ liệu ban đầu
    useEffect(() => {
        if (fullChatData) {
            setCurrentChatData(fullChatData);
            if (fullChatData.messages?.content) {
                setMessages(fullChatData.messages.content.slice().reverse());
            }
        }
    }, [fullChatData]);

    // REALTIME: Cập nhật tên, ảnh, thành viên nhóm khi có sự kiện từ WebSocket
    useEffect(() => {
        if (!updatedChats || Object.keys(updatedChats).length === 0) return;

        const chatId = chat?.id;
        if (!chatId) return;

        const updatedData = updatedChats[chatId];
        if (updatedData) {
            console.log('ChatDetail: Nhóm được cập nhật realtime', updatedData);

            setCurrentChatData(prev => ({
                ...prev,
                name: updatedData.name ?? prev.name,
                image: updatedData.image ?? prev.image,
                members: updatedData.members ?? prev.members,
            }));

            // Đánh dấu đã xử lý để xóa khỏi queue
            markChatAsUpdated(chatId);
        }
    }, [updatedChats, chat?.id, markChatAsUpdated]);

    // Reset chấm đỏ khi mở phòng
    useEffect(() => {
        resetUnreadCount();
    }, [chat?.id, resetUnreadCount]);

    // WebSocket: nhận tin nhắn mới
    const { sendMessage } = useMessageWebSocket(chat?.id, (newMessage) => {
        setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
        });
    });

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Gửi tin nhắn
    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage({
            content: input.trim(),
            senderId: currentUserId
        });
        setInput('');
    };

    // Nếu chưa chọn chat
    if (!chat) {
        return (
            <div className="chat-detail-empty">
                <div className="empty-icon">Message</div>
                <h3>Chào mừng đến với Chat</h3>
                <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
        );
    }

    return (
        <div className="chat-detail">
            {/* HEADER: Dùng currentChatData (đã được cập nhật realtime) */}
            <ChatDetailHeader
                chat={currentChatData}
                opponent={opponent}
                onUpdateGroup={() => setShowGroupUpdate(true)}
            />

            {/* POPUP CẬP NHẬT NHÓM */}
            {showGroupUpdate && currentChatData && chat.type === 'GROUP' && (
                <GroupUpdatePopup
                    chat={currentChatData}
                    onClose={() => setShowGroupUpdate(false)}
                    onUpdateSuccess={() => {
                        reload(); // vẫn reload nếu người dùng tự update (để lấy members mới nhất)
                        setShowGroupUpdate(false);
                    }}
                />
            )}

            {/* DANH SÁCH TIN NHẮN */}
            <div className="chat-messages-container">
                {loading ? (
                    <div className="chat-loading">
                        <div className="spinner"></div>
                        <p>Đang tải tin nhắn...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="empty-chat">
                        <p>Chưa có tin nhắn nào. Hãy gửi lời chào đầu tiên!</p>
                    </div>
                ) : (
                    <MessageList
                        messages={messages}
                        currentUserId={currentUserId}
                        chatType={chat.type}
                        opponent={opponent}
                    />
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Ô NHẬP TIN NHẮN */}
            <div className="chat-input-area">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Nhập tin nhắn..."
                    autoFocus
                />
                <button onClick={handleSend} disabled={!input.trim()}>
                    <AiOutlineSend size={24} />
                </button>
            </div>
        </div>
    );
};

export default memo(ChatDetail);
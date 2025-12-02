// src/pages/ChatPage.jsx
import React, { useState, useEffect, memo } from 'react';
import ChatList from './ChatList';
import ChatDetail from './ChatDetail';
import { getAllChats } from '../../apis/ChatService';
import { useAuth } from '../../context/AuthContext';
import './ChatPage.css';
import Navbar from '../Navbar/Navbar';
import SearchFriend from '../SearchFriend/SearchFriend';
const ChatPage = () => {
    const { token, user } = useAuth();

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // GỌI API NGAY KHI VÀO TRANG – HOÀN HẢO
    useEffect(() => {
        // Nếu chưa có token → không gọi (ví dụ: chưa login)
        if (!token) {
            setLoading(false);
            return;
        }

        const loadChats = async () => {
            try {
                setLoading(true);
                console.log("Đang tải danh sách chat...");
                const res = await getAllChats(token);
                setChats(res.data.content || []);
                console.log("Đã tải xong danh sách chat:", res.data.content);
            } catch (err) {
                console.error('Lỗi tải danh sách chat:', err);
                // Nếu lỗi 401 → có thể token hết hạn
                if (err.response?.status === 401) {
                    // Tùy dự án: redirect login hoặc refresh token
                }
            } finally {
                setLoading(false);
            }
        };

        loadChats();
    }, [token]); // ← Chỉ chạy lại khi token thay đổi (login/logout)

    // Khi chọn chat
    const selectChat = (chatFromList) => {
        const normalizedChat = {
            id: chatFromList.chatId,
            type: chatFromList.type,
            name: chatFromList.name,
            image: chatFromList.image,
            members: chatFromList.members || [],
            lastMessage: chatFromList.lastMessage,
            lastMessageDate: chatFromList.lastMessageDate
        };
        setSelectedChat(normalizedChat);
    };

    // Lọc tìm kiếm
    const filteredChats = chats.filter(chat =>
        (chat.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="chat-page">
            <Navbar />
            <div className="chat-page-body">

                <div className="chat-page-container">
                    {/* SIDEBAR */}
                    <div className={`chat-page-sidebar ${selectedChat ? 'hidden-mobile' : ''}`}>
                        <div className="chat-list-header">
                            <h1>Tin nhắn</h1>
                            <SearchFriend />
                        </div>

                        <ChatList
                            chats={filteredChats}
                            selectedChatId={selectedChat?.id}
                            onChatSelect={selectChat}
                            loading={loading}
                        />
                    </div>

                    {/* MAIN */}
                    <div className="chat-page-main">
                        {selectedChat ? (
                            <ChatDetail
                                key={selectedChat.id}           // Bắt buộc để reload khi đổi phòng
                                chat={selectedChat}
                                currentUserId={user?.id}
                            />
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">Message</div>
                                <h3>Chào mừng bạn đến với Chat</h3>
                                <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default memo(ChatPage);
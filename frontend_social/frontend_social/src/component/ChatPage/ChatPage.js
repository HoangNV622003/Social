// src/pages/ChatPage.jsx
import React, { useState, useEffect, memo } from 'react';
import ChatList from './ChatList';
import ChatDetail from './ChatDetail';
import { getAllChats } from '../../apis/ChatService';
import { useAuth } from '../../context/AuthContext';
import { useMiniChat } from '../../context/MiniChatContext';
import Navbar from '../Navbar/Navbar';
import SearchFriend from '../SearchFriend/SearchFriend';
import CreateGroupPopup from '../Popup/CreateGroupPopup/CreateGroupPopup'; // Import popup
import { SlOptions } from "react-icons/sl";
import './ChatPage.css';
import { toast } from 'react-toastify';
const ChatPage = () => {
    const { token, user } = useAuth();
    const { setIsEnabled } = useMiniChat();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // State cho popup tạo nhóm
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

    // Tải danh sách chat
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const loadChats = async () => {
            try {
                setLoading(true);
                const res = await getAllChats(token);
                setChats(res.data.content || []);
            } catch (err) {
                console.error('Lỗi tải danh sách chat:', err);
                if (err.response?.status === 401) {
                    // Xử lý logout nếu cần
                }
            } finally {
                setLoading(false);
            }
        };

        loadChats();
    }, [token]);

    useEffect(() => {
        setIsEnabled(false);
        return () => setIsEnabled(true);
    }, [setIsEnabled]);

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

    const filteredChats = chats.filter(chat =>
        (chat.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Hàm xử lý khi tạo nhóm thành công
    const handleCreateGroupSuccess = (message) => {
        toast.success(message || 'Tạo nhóm thành công!');
        setIsCreateGroupOpen(false);
        // Có thể reload lại danh sách chat nếu cần
        // loadChats();
    };

    return (
        <>
            <div className="chat-page">
                <Navbar />
                <div className="chat-page-body">
                    <div className="chat-page-container">

                        {/* SIDEBAR */}
                        <div className={`chat-page-sidebar ${selectedChat ? 'hidden-mobile' : ''}`}>
                            <div className="chat-list-header">
                                <div className="header-title">
                                    <div className="header-left">
                                        <h1>Tin nhắn</h1>
                                    </div>
                                    <div className="header-right">
                                        {/* NÚT MỞ POPUP TẠO NHÓM */}
                                        <button
                                            className="options-btn"
                                            onClick={() => setIsCreateGroupOpen(true)}
                                            title="Tạo nhóm chat mới"
                                        >
                                            <SlOptions size={20} />
                                        </button>
                                    </div>
                                </div>
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
                                    key={selectedChat.id}
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

            {/* POPUP TẠO NHÓM */}
            {isCreateGroupOpen && (
                <CreateGroupPopup
                    currentUserId={user?.id}
                    onClose={() => setIsCreateGroupOpen(false)}
                    onCreateSuccess={handleCreateGroupSuccess}
                />
            )}
        </>
    );
};

export default memo(ChatPage);
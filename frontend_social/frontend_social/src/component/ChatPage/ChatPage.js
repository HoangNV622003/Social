// src/pages/ChatPage.jsx
import React, { useState, useEffect, memo, useCallback } from 'react';
import ChatList from './ChatList';
import ChatDetail from './ChatDetail';
import { getAllChats, createPrivateChat } from '../../apis/ChatService';
import { useAuth } from '../../context/AuthContext';
import { useMiniChat } from '../../context/MiniChatContext';
import Navbar from '../Navbar/Navbar';
import SearchFriend from '../SearchFriend/SearchFriend';
import CreateGroupPopup from '../Popup/CreateGroupPopup/CreateGroupPopup';
import { SlOptions } from "react-icons/sl";
import './ChatPage.css';
import { toast } from 'react-toastify';

// Hook lắng nghe khi được thêm vào nhóm mới
import { useChatWebSocket } from '../../hooks/useChatWebSocket';

const ChatPage = () => {
    const { token, user } = useAuth();
    const { setIsEnabled } = useMiniChat();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

    // Tải danh sách chat ban đầu
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
                toast.error('Không thể tải tin nhắn');
            } finally {
                setLoading(false);
            }
        };

        loadChats();
    }, [token]);

    // Tắt mini chat khi vào trang chat chính
    useEffect(() => {
        setIsEnabled(false);
        return () => setIsEnabled(true);
    }, [setIsEnabled]);

    // Chọn chat từ danh sách
    const selectChat = useCallback((chatFromList) => {
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
    }, []);

    // Khi chọn bạn từ ô tìm kiếm → tạo/mở chat riêng
    const handleSearchFriendSelect = async (friend) => {
        try {
            const payload = { userId: friend.id };
            const response = await createPrivateChat(payload, token);

            const newChat = {
                id: response.data.id,
                type: response.data.type,
                name: friend.username,
                image: friend.image || null,
                members: [
                    { id: user.id, username: user.username },
                    { id: friend.id, username: friend.username }
                ],
                lastMessage: null,
                lastMessageDate: null
            };

            setSelectedChat(newChat);

            setChats(prev => {
                const exists = prev.some(c => c.chatId === newChat.id);
                if (!exists) {
                    return [{ ...newChat, chatId: newChat.id }, ...prev];
                }
                return prev;
            });

        } catch (err) {
            console.error('Lỗi mở cuộc trò chuyện:', err);
            toast.error('Không thể mở cuộc trò chuyện với người này');
        }
    };

    // LẮNG NGHE SỰ KIỆN: "BẠN ĐƯỢC THÊM VÀO NHÓM MỚI"
    const handleGroupAdded = useCallback((newGroup) => {
        setChats(prev => {
            const exists = prev.some(chat => chat.chatId === newGroup.chatId);
            if (exists) return prev;

            const formattedGroup = {
                chatId: newGroup.chatId,
                name: newGroup.name || 'Nhóm chat',
                type: newGroup.type || 'GROUP',
                image: newGroup.image || null,
                lastMessage: 'Bạn đã được thêm vào nhóm',
                lastMessageDate: newGroup.lastMessageDate || Date.now(),
                members: newGroup.members || []
            };
            return [formattedGroup, ...prev];
        });
    }, []);

    // KÍCH HOẠT LẮNG NGHE REAL-TIME KHI ĐƯỢC THÊM VÀO NHÓM
    useChatWebSocket(handleGroupAdded);

    const handleCreateGroupSuccess = (message) => {
        toast.success(message || 'Tạo nhóm thành công!');
        setIsCreateGroupOpen(false);
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
                                        <button
                                            className="options-btn"
                                            onClick={() => setIsCreateGroupOpen(true)}
                                            title="Tạo nhóm chat mới"
                                        >
                                            <SlOptions size={20} />
                                        </button>
                                    </div>
                                </div>

                                <SearchFriend onSelect={handleSearchFriendSelect} token={token} user={user} />
                            </div>

                            <ChatList
                                chats={chats}
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
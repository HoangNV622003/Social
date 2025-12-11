// src/pages/ChatPage.jsx
import React, { useState, useEffect, memo, useCallback } from 'react';
import ChatList from './ChatList';
import ChatDetail from './ChatDetail';
import { getAllChats, createPrivateChat } from '../../apis/ChatService';
import { useAuth } from '../../context/AuthContext';
import { useMiniChat } from '../../context/MiniChatContext';
import Navbar from '../../component/Navbar/Navbar';
import SearchFriend from '../SearchFriend/SearchFriend';
import CreateGroupPopup from '../../component/Popup/CreateGroupPopup/CreateGroupPopup';
import { SlOptions } from "react-icons/sl";
import './ChatPage.css';
import { toast } from 'react-toastify';

// QUAN TRỌNG: Dùng đúng các hook realtime
import { useNewGroups, useRemovedChats, useUpdatedChats } from '../../context/ChatRealtimeContext';

const ChatPage = () => {
    const { token, user } = useAuth();
    const { setIsEnabled } = useMiniChat();
    const [chats, setChats] = useState([]);           // mảng chat trong sidebar
    const [selectedChat, setSelectedChat] = useState(null); // chat đang mở
    const [loading, setLoading] = useState(true);
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

    // Realtime hooks
    const { newGroups, markGroupAsProcessed } = useNewGroups();
    const { chatIdsToRemove, consumeRemovedChatIds } = useRemovedChats();
    const { updatedChats, markChatAsUpdated } = useUpdatedChats();

    // Tắt mini chat khi vào trang chính
    useEffect(() => {
        setIsEnabled(false);
        return () => setIsEnabled(true);
    }, [setIsEnabled]);

    // Load danh sách chat ban đầu
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const loadChats = async () => {
            try {
                setLoading(true);
                const res = await getAllChats(token);
                const chatList = (res.data.content || []).map(chat => ({
                    chatId: chat.chatId,                    // từ ChatResponseDTO
                    id: chat.chatId,                        // để selectedChat dùng
                    name: chat.name || 'Chat mới',
                    image: chat.image,
                    type: chat.type,
                    lastMessage: chat.lastMessage,
                    lastMessageDate: chat.lastMessageDate
                        ? new Date(chat.lastMessageDate * 1000).toISOString()
                        : null,
                }));
                setChats(chatList);
            } catch (err) {
                console.error('Lỗi tải danh sách chat:', err);
                toast.error('Không thể tải tin nhắn');
            } finally {
                setLoading(false);
            }
        };

        loadChats();
    }, [token]);

    // 1. XỬ LÝ NHÓM MỚI (khi được thêm vào nhóm)
    useEffect(() => {
        if (newGroups.length === 0) return;

        newGroups.forEach(group => {
            setChats(prev => {
                const exists = prev.some(c => c.chatId === group.chatId);
                if (exists) {
                    markGroupAsProcessed(group.chatId);
                    return prev;
                }

                const newChat = {
                    chatId: group.chatId,
                    id: group.chatId,                         // quan trọng!
                    name: group.name || 'Nhóm mới',
                    image: group.image || null,
                    type: 'GROUP',
                    lastMessage: 'Bạn đã được thêm vào nhóm',
                    lastMessageDate: new Date().toISOString(),
                    members: group.members || [],
                };

                markGroupAsProcessed(group.chatId);
                return [newChat, ...prev];
            });
        });
    }, [newGroups.length]);

    // 2. XỬ LÝ BỊ XÓA KHỎI NHÓM / GIẢI TÁN NHÓM
    useEffect(() => {
        if (chatIdsToRemove.length === 0) return;

        const idsToRemove = chatIdsToRemove.map(id => Number(id));

        setChats(prev => {
            const newChats = prev.filter(chat => !idsToRemove.includes(chat.chatId));

            if (selectedChat && idsToRemove.includes(selectedChat.id)) {
                setSelectedChat(null);
            }

            consumeRemovedChatIds(chatIdsToRemove);
            return newChats;
        });
    }, [chatIdsToRemove.length]);

    // 3. XỬ LÝ CẬP NHẬT NHÓM (tên, ảnh, thành viên)
    useEffect(() => {
        if (Object.keys(updatedChats).length === 0) return;

        Object.entries(updatedChats).forEach(([rawId, data]) => {
            const chatId = Number(rawId);

            setChats(prev =>
                prev.map(chat =>
                    chat.chatId === chatId
                        ? {
                            ...chat,
                            name: data.name ?? chat.name,
                            image: data.image ?? chat.image,
                            members: data.members ?? chat.members,
                        }
                        : chat
                )
            );

            if (selectedChat?.id === chatId) {
                setSelectedChat(prev => ({
                    ...prev,
                    name: data.name ?? prev.name,
                    image: data.image ?? prev.image,
                    members: data.members ?? prev.members,
                }));
            }

            markChatAsUpdated(chatId);
        });
    }, [Object.keys(updatedChats).length]);

    // Khi chọn chat từ sidebar
    const selectChat = useCallback(chatFromList => {
        setSelectedChat({
            id: chatFromList.chatId,        // ← đây là thứ ChatDetail dùng để gọi API
            type: chatFromList.type,
            name: chatFromList.name,
            image: chatFromList.image,
            members: chatFromList.members || [],
            lastMessage: chatFromList.lastMessage,
            lastMessageDate: chatFromList.lastMessageDate,
        });
    }, []);

    // Tạo chat riêng khi chọn bạn từ ô tìm kiếm
    const handleSearchFriendSelect = async friend => {
        try {
            const payload = { userId: friend.id };
            const response = await createPrivateChat(payload, token);

            const newChatItem = {
                chatId: response.data.id,
                id: response.data.id,
                name: friend.username,
                image: friend.image || null,
                type: 'PRIVATE',
                members: [
                    { id: user.id, username: user.username },
                    { id: friend.id, username: friend.username },
                ],
                lastMessage: null,
                lastMessageDate: null,
            };

            setSelectedChat({
                id: newChatItem.id,
                type: newChatItem.type,
                name: newChatItem.name,
                image: newChatItem.image,
                members: newChatItem.members,
            });

            setChats(prev => {
                if (prev.some(c => c.chatId === newChatItem.chatId)) return prev;
                return [newChatItem, ...prev];
            });
        } catch (err) {
            console.error('Lỗi mở cuộc trò chuyện:', err);
            toast.error('Không thể mở cuộc trò chuyện với người này');
        }
    };

    const handleCreateGroupSuccess = message => {
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

                        {/* MAIN CHAT */}
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
                                    <h3>Chào mừng đến với Chat</h3>
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
// src/context/ChatRealtimeContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useWebSocket } from './WebSocketContext';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import WS from '../constants/WSConstants';
const ChatRealtimeContext = createContext();

export const ChatRealtimeProvider = ({ children }) => {
    const { client } = useWebSocket();
    const { user } = useAuth();

    // Tin nhắn mới nhất mỗi phòng
    const [latestMessages, setLatestMessages] = useState({});

    // Nhóm mới được thêm vào
    const [pendingNewGroups, setPendingNewGroups] = useState([]);

    // Tổng số tin nhắn chưa đọc (từ mọi phòng)
    const [unreadCount, setUnreadCount] = useState(0);

    // danh sách chatIds cần xóa
    const [chatIdsToRemove, setChatIdsToRemove] = useState([]);
    // 1. Lắng nghe TẤT CẢ tin nhắn từ mọi phòng
    const [updatedChats, setUpdatedChats] = useState({});
    useEffect(() => {
        if (!client?.connected) return;

        const subscription = client.subscribe('/topic/chat/**', (message) => {
            try {
                const data = JSON.parse(message.body);
                if (!data.id) return; // bỏ qua tin tạm

                const destination = message.headers.destination;
                const chatId = destination.split('/').pop();

                // Cập nhật tin nhắn mới nhất
                setLatestMessages(prev => ({
                    ...prev,
                    [chatId]: {
                        content: data.content,
                        createdAt: data.createdAt || new Date().toISOString(),
                        senderId: data.senderId,
                    }
                }));

                // Tăng số tin chưa đọc (nếu không phải tin của mình)
                if (data.senderId !== user?.id) {
                    setUnreadCount(prev => prev + 1);
                }
            } catch (err) {
                console.error('Parse message error:', err);
            }
        });

        return () => subscription?.unsubscribe();
    }, [client?.connected, user?.id]);

    // 2. Lắng nghe khi được thêm vào nhóm mới
    useEffect(() => {
        if (!client?.connected || !user?.id) return;

        const subscription = client.subscribe(WS.TOPIC.NEW_CHAT(user.id), (message) => {
            try {
                const group = JSON.parse(message.body);
                if (!group?.chatId) return;

                setPendingNewGroups(prev => [...prev, group]);

                toast.info(group.message || 'Bạn đã được thêm vào nhóm mới!', {
                    toastId: `new-group-${group.chatId}`,
                });
            } catch (err) {
                console.error('Parse new group error:', err);
            }
        });

        return () => subscription?.unsubscribe();
    }, [client?.connected, user?.id]);

    // THÊM EFFECT MỚI: LẮNG NGHE XÓA KHỎI NHÓM HOẶC GIẢI TÁN NHÓM
    useEffect(() => {
        if (!client?.connected || !user?.id) return;


        const subscription = client.subscribe(WS.TOPIC.REMOVE_CHAT(user.id), (message) => {
            try {
                const chatIdToRemove = message.body; // backend gửi chatId dạng text
                const id = Number(chatIdToRemove);

                if (id) {
                    setChatIdsToRemove(prev => [...prev, id]);
                    toast.info('Bạn đã bị xóa khỏi một nhóm chat', { autoClose: 4000 });
                }
            } catch (err) {
                console.error('Lỗi xử lý remove chat:', err);
            }
        });

        return () => subscription?.unsubscribe();
    }, [client?.connected, user?.id]);

    // THÊM EFFECT: LẮNG NGHE CẬP NHẬT NHÓM CHAT
    useEffect(() => {
        if (!client?.connected || !user?.id) return;
        const subscription = client.subscribe(WS.TOPIC.UPDATE_CHAT(user.id), (message) => {
            try {
                const updatedChat = JSON.parse(message.body);
                if (updatedChat?.id) {
                    // Lưu vào state để các component dùng
                    setUpdatedChats(prev => ({
                        ...prev,
                        [updatedChat.id]: updatedChat
                    }));

                    toast.success('Nhóm chat đã được cập nhật!', {
                        autoClose: 3000,
                        toastId: `update-chat-${updatedChat.id}`
                    });
                }
            } catch (err) {
                console.error('Lỗi parse update-chat:', err);
            }
        });

        return () => subscription?.unsubscribe();
    }, [client?.connected, user?.id]);

    // Hàm để component báo "đã xử lý xong cập nhật"
    const markChatAsUpdated = (chatId) => {
        setUpdatedChats(prev => {
            const newState = { ...prev };
            delete newState[chatId];
            return newState;
        });
    };
    // Hàm để ChatPage lấy danh sách cần xóa và đánh dấu đã xử lý
    const consumeRemovedChatIds = (ids) => {
        setChatIdsToRemove(prev => prev.filter(id => !ids.includes(id)));
    };

    // Reset unread khi mở trang chat
    const resetUnreadCount = () => setUnreadCount(0);

    const markGroupAsProcessed = (chatId) => {
        setPendingNewGroups(prev => prev.filter(g => g.chatId !== chatId));
    };

    return (
        <ChatRealtimeContext.Provider value={{
            latestMessages,
            pendingNewGroups,
            unreadCount,
            chatIdsToRemove,
            updatedChats,
            markChatAsUpdated,
            consumeRemovedChatIds,
            resetUnreadCount,
            markGroupAsProcessed: markGroupAsProcessed,
        }}>
            {children}
        </ChatRealtimeContext.Provider>
    );
};

// Hook tiện lợi
export const useRealtime = () => useContext(ChatRealtimeContext);
export const useLatestMessage = (chatId) => {
    const { latestMessages } = useRealtime();
    return latestMessages[chatId] || null;
};
export const useNewGroups = () => {
    const { pendingNewGroups, markGroupAsProcessed } = useRealtime();
    return { newGroups: pendingNewGroups, markGroupAsProcessed };
};
export const useUnreadChatCount = () => {
    const { unreadCount, resetUnreadCount } = useRealtime();
    return { unreadCount, resetUnreadCount };
};
export const useRemovedChats = () => {
    const { chatIdsToRemove, consumeRemovedChatIds } = useRealtime();
    return { chatIdsToRemove, consumeRemovedChatIds };
};

export const useUpdatedChats = () => {
    const { updatedChats, markChatAsUpdated } = useRealtime();
    return { updatedChats, markChatAsUpdated };
};
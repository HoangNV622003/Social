// src/components/chat/MiniChatManager.jsx
import React, { useState, useEffect } from 'react';
import MiniChat from './MiniChat';
import { useAuth } from '../../context/AuthContext';
import { useMiniChat } from '../../context/MiniChatContext'; // Dùng đúng context bạn đã có

const MiniChatManager = () => {
    const { user: currentUser } = useAuth();
    const { isEnabled } = useMiniChat(); // Lấy trạng thái từ context bạn đã tạo

    const [openChats, setOpenChats] = useState([]);
    // Mỗi phần tử: { chat: {...}, currentUserId: 123 }

    // Hàm mở chat (gọi từ nút "Nhắn tin")
    const openChat = (chatData) => {
        if (!chatData?.id || !isEnabled) return;

        // Không mở lại nếu đã tồn tại
        if (openChats.some(item => item.chat.id === chatData.id)) {
            return;
        }

        setOpenChats(prev => [
            ...prev,
            { chat: chatData, currentUserId: currentUser?.id }
        ]);
    };

    // Đóng 1 cửa sổ chat
    const closeChat = (chatId) => {
        setOpenChats(prev => prev.filter(item => item.chat.id !== chatId));
    };

    // Tự động đóng hết khi vào trang chat chính (isEnabled = false)
    useEffect(() => {
        if (!isEnabled) {
            setOpenChats([]);
        }
    }, [isEnabled]);

    // Expose hàm global để các component khác gọi được
    useEffect(() => {
        window.openMiniChat = openChat;
        return () => {
            delete window.openMiniChat;
        };
    }, [currentUser?.id, isEnabled]);

    // Nếu bị tắt hoặc không có chat nào → không render
    if (!isEnabled || openChats.length === 0) {
        return null;
    }

    return (
        <div className="mini-chat-manager">
            {openChats.map((item, index) => (
                <div
                    key={item.chat.id}
                    className="mini-chat-wrapper"
                    style={{
                        position: 'fixed',
                        bottom: `${20 + index * 520}px`, // xếp chồng đẹp
                        right: '20px',
                        zIndex: 1000 + index,
                    }}
                >
                    <MiniChat
                        chat={item.chat}
                        currentUserId={item.currentUserId}
                        onClose={() => closeChat(item.chat.id)}
                    />
                </div>
            ))}
        </div>
    );
};

export default MiniChatManager;
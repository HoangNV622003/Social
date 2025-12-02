import React, { memo } from 'react';
import ChatItem from './ChatItem';
import './ChatList.css';

const ChatList = ({ chats, selectedChatId, onChatSelect, loading }) => {
    if (loading) return <div className="empty-chat-list">Đang tải tin nhắn...</div>;
    if (!chats?.length) return <div className="empty-chat-list">Chưa có tin nhắn nào</div>;

    return (
        <div className="chat-list-container">
            {chats.map(chat => (
                <ChatItem
                    key={chat.chatId}
                    chat={chat}
                    isActive={selectedChatId === chat.chatId}
                    onClick={() => onChatSelect(chat)}
                />
            ))}
        </div>
    );
};

export default memo(ChatList);
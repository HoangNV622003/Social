// src/components/chat/ChatItem.jsx
import React from 'react';
import { formatMessageTime } from '../../utils/DateUtils';
import UserAvatar from '../../component/UserAvatar/UserAvatar';
import { useLatestMessage } from '../../context/ChatRealtimeContext'; // THÊM DÒNG NÀY
import './ChatItem.css';

const ChatItem = ({ chat, isActive, onClick }) => {
    const latest = useLatestMessage(chat.chatId);

    const display = latest || {
        content: chat.lastMessage || 'Chưa có tin nhắn',
        createdAt: chat.lastMessageDate
    };

    return (
        <div className={`chat-item ${isActive ? 'active' : ''}`} onClick={onClick}>
            <UserAvatar username={chat.name} image={chat.image} size="medium" />

            <div className="chat-item-content">
                <div className="chat-item-name">
                    <span className="username">{chat.name}</span>
                    <span className="chat-item-time">
                        {display.createdAt && formatMessageTime(display.createdAt)}
                    </span>
                </div>
                <p className="chat-item-preview">{display.content}</p>
            </div>
        </div>
    );
};

export default ChatItem;
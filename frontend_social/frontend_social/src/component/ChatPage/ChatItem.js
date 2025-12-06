// src/components/chat/ChatItem.jsx
import React from 'react';
import { formatMessageTime } from '../../utils/DateUtils';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ChatItem.css';

const ChatItem = ({ chat, isActive, onClick }) => {
    return (
        <div className={`chat-item ${isActive ? 'active' : ''}`} onClick={onClick}>
            <UserAvatar
                username={chat.name}
                image={chat.image}
                size="medium"
                showOnline={true} />

            <div className="chat-item-content">
                <div className="chat-item-name">
                    <span className="username">{chat.name}</span>
                    <span className="chat-item-time">
                        {chat.lastMessageDate ? formatMessageTime(chat.lastMessageDate) : ''}
                    </span>
                </div>
                <p className="chat-item-preview">
                    {chat.lastMessage || 'Chưa có tin nhắn'}
                </p>
            </div>
        </div>
    );
};

export default ChatItem;
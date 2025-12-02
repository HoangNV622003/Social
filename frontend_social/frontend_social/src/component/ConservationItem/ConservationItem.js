// src/components/ConversationItem/ConversationItem.jsx
import React from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import timeAgo from '../../Ago';
import './ConversationItem.css';

const ConversationItem = ({ conversation, isActive = false, onSelect, onDelete }) => {
    const {
        chatId,
        username,
        image,
        lastMessageContent,
        lastMessageTimestamp,
        unreadCount,
        online
    } = conversation;

    const hasUnread = unreadCount > 0;

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Xóa toàn bộ cuộc trò chuyện này?')) {
            onDelete(chatId);
        }
    };

    return (
        <div
            className={`conversation-item ${isActive ? 'active' : ''} ${hasUnread ? 'unread' : ''}`}
            onClick={() => onSelect(conversation)}
        >
            <UserAvatar username={username} image={image} size="large" showOnline={!!online} />

            <div className="conversation-details">
                <h3 className="conversation-username">{username}</h3>
                <p className="conversation-preview">
                    {lastMessageContent || 'Bắt đầu trò chuyện'}
                </p>
                {lastMessageTimestamp && (
                    <span className="conversation-time">
                        {timeAgo(lastMessageTimestamp)}
                    </span>
                )}
            </div>

            {hasUnread && (
                <div className="unread-count-badge">
                    {unreadCount > 99 ? '99+' : unreadCount}
                </div>
            )}

            <button
                className="delete-chat-btn"
                onClick={handleDelete}
                title="Xóa cuộc trò chuyện"
                aria-label="Xóa cuộc trò chuyện"
            >
                {/* Icon xóa – inline, không cần import */}
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
            </button>
        </div>
    );
};

export default ConversationItem;
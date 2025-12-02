// src/components/chat/MessageList.jsx
import React, { memo } from 'react';
import MessageItem from './MessageItem';
import './MessageList.css';

const MessageList = ({
    messages,
    currentUserId,
    chatType,
    opponent,
    loadingMore,
}) => {
    console.log("opponent in MessageList:", opponent);

    return (
        <div className="message-list">
            {loadingMore && <div className="loading-more">Đang tải tin cũ...</div>}

            {/* SỬA: Chỉ kiểm tra messages.length */}
            {messages.length === 0 && !loadingMore && (
                <div className="empty-chat">
                    Chưa có tin nhắn nào. Hãy gửi lời chào!
                </div>
            )}

            {messages.map((msg) => {
                const key = msg.id
                    ? `msg-${msg.id}`
                    : `temp-${msg.clientTempId}`;
                return (
                    <MessageItem
                        key={key}
                        message={msg}
                        currentUserId={currentUserId}
                        chatType={chatType}
                        opponent={opponent}
                    />
                );
            })}
        </div>
    );
};

export default memo(MessageList);
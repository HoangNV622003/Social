// src/components/chat/MessageItem.jsx
import React, { memo } from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import { formatChatTime } from '../../utils/DateUtils';
import './MessageItem.css';

const MessageItem = ({ message, currentUserId, chatType, opponent }) => {
    const isMe = String(message.senderId) === String(currentUserId);
    // Người gửi (dùng cho group chat)
    const sender = isMe
        ? null
        : (message.sender || opponent); // fallback về opponent nếu không có sender
    // Thời gian
    const time = typeof message.dateCreated === 'number'
        ? new Date(message.dateCreated * 1000)
        : new Date(message.dateCreated);

    // === TRẠNG THÁI TIN NHẮN (chỉ hiện cho tin nhắn của mình) ===
    const getMessageStatus = () => {
        if (!isMe) return null;

        if (message.isPending) {
            return <span className="msg-status pending">Đang gửi...</span>;
        }

        // Tin nhắn tạm (chưa có id từ server)
        if (message.clientTempId && !message.id) {
            return <span className="msg-status sending">Đang gửi</span>;
        }

        // Đã có id → đã gửi thành công
        if (message.id) {
            if (message.seen || message.read) {
                return <span className="msg-status seen">Đã xem</span>;
            }
            return <span className="msg-status sent">Đã gửi</span>;
        }

        return null;
    };

    return (
        <div className={`message-wrapper ${isMe ? 'me' : 'other'}`}>
            {/* Avatar bên trái (người khác gửi) */}
            {!isMe && (
                <UserAvatar
                    username={message?.senderName || 'Unknown'}
                    image={message?.senderImage || null}
                    size="small"
                    className="message-avatar"
                />
            )}

            {/* Bubble tin nhắn */}
            <div className={`message-bubble ${isMe ? 'me' : 'other'}`}>
                {/* Tên người gửi (group) */}
                {chatType === 'GROUP' && !isMe && sender && (
                    <div className="sender-name">{sender.username}</div>
                )}

                <p className="message-content">{message.content}</p>

                {/* Dòng nhỏ phía dưới */}
                <div className="message-footer">
                    {formatChatTime(time)}
                    {isMe && (
                        <span className="status">
                            {message.isPending ? 'pending' :
                                !message.id ? 'sent' :
                                    message.seen ? 'seen' : 'sent'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(MessageItem);
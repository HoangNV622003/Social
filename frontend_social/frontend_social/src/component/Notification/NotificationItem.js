// src/components/notification/NotificationItem.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../UserAvatar/UserAvatar';
import { formatMessageTime } from '../../utils/DateUtils';
import './NotificationItem.css';

const NotificationItem = ({ notification }) => {
    const navigate = useNavigate();

    const { id, userId, username, image, content, deepLink, dateCreated, type, status } = notification;

    // Xử lý click vào toàn bộ thông báo → đi đến deepLink
    const handleNotificationClick = () => {
        if (deepLink) {
            navigate(deepLink);
        }
    };
    console.log("type", type)
    // Click vào avatar hoặc tên → đi đến trang cá nhân
    const handleUserClick = (e) => {
        e.stopPropagation(); // Ngăn đi đến bài viết
        navigate(`/profile/${userId}`);
    };

    const timeDisplay = dateCreated ? formatMessageTime(dateCreated) : 'Vừa xong';

    const isUnread = status === 'UNREAD';

    return (
        <div
            className={`notification-item ${isUnread ? 'unread' : ''}`}
            onClick={handleNotificationClick}
        >
            <div className="notification-avatar" onClick={handleUserClick}>
                <UserAvatar username={username} image={image} size="medium" />
            </div>

            <div className="notification-content">
                <div className="notification-text">
                    <span className="notification-username" onClick={handleUserClick}>
                        {username}
                    </span>{' '}
                    {content}
                </div>
                <span className="notification-time">{timeDisplay}</span>
            </div>

            {/* Chấm xanh nếu chưa đọc */}
            {isUnread && <div className="unread-dot" />}
        </div>
    );
};

export default NotificationItem;
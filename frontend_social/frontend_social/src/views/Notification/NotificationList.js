// src/components/notification/NotificationList.js
import React from 'react';
import NotificationItem from './NotificationItem';
import './NotificationList.css';

const NotificationList = ({ notifications = [], loading = false }) => {
    if (loading) {
        return (
            <div className="notification-loading">
                <div className="spinner"></div>
                <p>Đang tải thông báo...</p>
            </div>
        );
    }

    if (!notifications || notifications.length === 0) {
        return (
            <div className="notification-empty">
                <h3>Chưa có thông báo nào</h3>
                <p>Khi có hoạt động mới, bạn sẽ thấy ở đây.</p>
            </div>
        );
    }

    return (
        <div className="notification-list">
            {notifications.map((noti) => (
                <NotificationItem key={noti.id} notification={noti} />
            ))}
        </div>
    );
};

export default NotificationList;
// src/components/Notification/NotificationOptionsPopup.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { markAllAsRead } from '../../apis/NotificationService';
import { toast } from 'react-toastify';
import './NotificationOptionsPopup.css';

const NotificationOptionsPopup = ({ onClose, onMarkedAllRead }) => {
    const { token } = useAuth();

    const handleMarkAllAsRead = async () => {
        if (!token) {
            toast.error('Không tìm thấy token');
            return;
        }
        try {
            await markAllAsRead(token);
            toast.success('Đã đánh dấu tất cả là đã đọc');
            onMarkedAllRead?.();
            onClose();
        } catch (err) {
            toast.error('Có lỗi khi đánh dấu đã đọc');
        }
    };

    return (
        // CHỈ CÓ POPUP – KHÔNG CÓ OVERLAY
        <div className="notification-options-popup">
            <button onClick={handleMarkAllAsRead} className="popup-item">
                Đánh dấu tất cả là đã đọc
            </button>
        </div>
    );
};

export default NotificationOptionsPopup;
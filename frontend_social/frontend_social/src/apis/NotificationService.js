// src/services/NotificationService.js
import axios from 'axios';
import { API_URL } from '../constants/apiConstants';

// Base URL
const NOTIFICATION_API = `${API_URL}/notifications`;


// Helper tạo header có token
const authHeader = (accessToken) => ({
    headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    },
});


export const getMyNotifications = async (accessToken, page = 0, size = 20) => {
    const response = await axios.get(NOTIFICATION_API, {
        ...authHeader(accessToken),
        params: { page, size },
    });
    return response.data; // Spring trả về Page<NotificationResponseDTO>
}

/**
 * Tạo thông báo mới (dành cho admin hoặc hệ thống)
 * @param {Object} data - CreateNotificationRequest
 * @returns Promise<void>
 */
export const createNotification = async (accessToken, data) => {
    await axios.post(NOTIFICATION_API, data, authHeader(accessToken));
}

/**
 * Đánh dấu tất cả thông báo của user hiện tại là đã đọc
 * @returns Promise<void>
 */
export const markAllAsRead = async (accessToken) => {
    await axios.post(`${NOTIFICATION_API}/mark-all-read`, {}, authHeader(accessToken));
}

/**
 * Đánh dấu một thông báo theo id là đã đọc
 * @param {number|string} notificationId
 * @returns Promise<void>
 */
export const markAsRead = async (accessToken, notificationId) => {
    await axios.post(
        `${NOTIFICATION_API}/mark-read/${notificationId}`,
        authHeader(accessToken)
    );
}

/**
 * Lấy số lượng thông báo chưa đọc (tùy chọn - nếu bạn muốn thêm endpoint này sau)
 */
export const getUnreadCount = async (accessToken) => {
    const response = await axios.get(`${NOTIFICATION_API}/unread-count`, authHeader(accessToken));
    return response.data; // ví dụ trả về { count: 5 }
}


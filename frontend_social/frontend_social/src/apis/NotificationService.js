// apis/NotificationService.js
import axios from 'axios';
import { API_URL } from '../constants/apiConstants';

// Base URL cho notification
const NOTIFICATION_API = `${API_URL}/notifications`;

// Helper thêm token
const authHeader = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

/**
 * 1. Lấy danh sách thông báo chưa đọc
 * GET /api/notifications/unread
 */
export const getUnreadNotifications = async (token) => {
    return await axios.get(`${NOTIFICATION_API}/unread`, authHeader(token));
};

/**
 * 2. Lấy tất cả thông báo của người dùng hiện tại (phân trang)
 * GET /api/notifications?page=0&size=5
 */
export const getNotifications = async (token, page = 0, size = 10) => {
    return await axios.get(NOTIFICATION_API, {
        ...authHeader(token),
        params: { page, size }
    });
};

/**
 * 3. Đánh dấu tất cả thông báo là đã đọc
 * POST /api/notifications/mark-all-read
 */
export const markAllNotificationsAsRead = async (token) => {
    return await axios.post(`${NOTIFICATION_API}/mark-all-read`, null, authHeader(token));
};

/**
 * Bonus: Đánh dấu 1 thông báo cụ thể là đã đọc (nếu backend có)
 * POST /api/notifications/mark-read/{id}
 */
// export const markNotificationAsRead = async (token, notificationId) => {
//     return await axios.post(`${NOTIFICATION_API}/mark-read/${notificationId}`, null, authHeader(token));
// };
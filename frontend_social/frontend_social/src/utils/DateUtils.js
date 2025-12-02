// src/utils/dateUtils.js

/**
 * Format thời gian kiểu Zalo/Messenger:
 * - Vừa xong
 * - 5 phút trước
 * - 2 giờ trước
 * - Hôm qua
 * - 25/12/2024
 * - Thứ 2, 10:30
 */
export const formatMessageTime = (timestamp) => {
    if (!timestamp) return 'Vừa xong';

    const now = new Date();
    const date = new Date(timestamp);
    const diffInMs = now - date;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    // Hôm nay
    if (diffInDays === 0) {
        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
    }

    // Hôm qua
    if (diffInDays === 1) {
        return 'Hôm qua';
    }

    // Trong vòng 7 ngày → hiện thứ mấy
    if (diffInDays < 7) {
        const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        return days[date.getDay()];
    }

    // Quá 7 ngày → hiện ngày/tháng/năm
    return date.toLocaleDateString('vi-VN'); // 25/12/2024
};

/**
 * Format thời gian chi tiết cho tin nhắn (dùng trong màn hình chat)
 * Ví dụ: 10:05, Hôm nay, 14:30, Hôm qua, 10:30
 */
export const formatChatTime = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const isYesterday =
        date.getDate() === now.getDate() - 1 &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (isToday) {
        return `${hours}:${minutes}`;
    }
    if (isYesterday) {
        return `Hôm qua ${hours}:${minutes}`;
    }

    // Quá 1 ngày → hiện đầy đủ: 25/12, 10:30
    return `${date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
    })}, ${hours}:${minutes}`;
};

/**
 * Format ngày tháng đầy đủ: 28 Tháng 11, 2025
 */
export const formatFullDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

/**
 * Format giờ phút: 14:30
 */
export const formatTimeOnly = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};
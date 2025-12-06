// Múi giờ cố định cho Việt Nam
const VIETNAM_TZ = 'Asia/Ho_Chi_Minh';

/**
 * Trả về Date object theo giờ Việt Nam.
 * Hỗ trợ cả epochSecond (10 số) và epochMilli (13 số).
 */
export const getVietnamDate = (timestamp) => {
    if (timestamp === null || timestamp === undefined) return null;

    // Nếu backend trả về epochSecond (10 chữ số) → nhân 1000
    const ts =
        typeof timestamp === 'number' && timestamp.toString().length === 10
            ? timestamp * 1000
            : timestamp;

    const date = new Date(ts);
    if (isNaN(date.getTime())) return null;

    // Format theo múi giờ Việt Nam
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: VIETNAM_TZ,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(date);

    // Convert formatToParts → object
    const obj = {};
    parts.forEach((p) => {
        if (p.type !== 'literal') obj[p.type] = p.value;
    });

    // Trả về Date local nhưng dữ liệu theo giờ VN
    return new Date(
        Number(obj.year),
        Number(obj.month) - 1,
        Number(obj.day),
        Number(obj.hour),
        Number(obj.minute),
        Number(obj.second)
    );
};

/**
 * Format thời gian tin nhắn: 
 * - "Vừa xong"
 * - "10 phút trước"
 * - "Hôm qua"
 * - "Thứ 3"
 * - "25/12/2024"
 */
export const formatMessageTime = (timestamp) => {
    if (!timestamp) return 'Vừa xong';

    const date = getVietnamDate(timestamp);
    if (!date) return 'Vừa xong';

    const now = getVietnamDate(Date.now());
    const diffMs = now - date;

    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(diffMs / 60000);
    const hrs = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (days === 0) {
        if (sec < 60) return 'Vừa xong';
        if (min < 60) return `${min} phút trước`;
        return `${hrs} giờ trước`;
    }

    if (days === 1) return 'Hôm qua';

    if (days < 7) {
        const names = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        return names[date.getDay()];
    }

    return date.toLocaleDateString('vi-VN');
};

/**
 * Format trong danh sách chat:
 * - "12:05"
 * - "Hôm qua 08:30"
 * - "25/12, 14:20"
 */
export const formatChatTime = (timestamp) => {
    if (!timestamp) return '';

    const date = getVietnamDate(timestamp);
    if (!date) return '';

    const now = getVietnamDate(Date.now());

    const sameDay =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    const yesterdayDate = new Date(now.getTime() - 86400000);
    const isYesterday =
        date.getFullYear() === yesterdayDate.getFullYear() &&
        date.getMonth() === yesterdayDate.getMonth() &&
        date.getDate() === yesterdayDate.getDate();

    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');

    if (sameDay) return `${hh}:${mm}`;
    if (isYesterday) return `Hôm qua ${hh}:${mm}`;

    return `${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}, ${hh}:${mm}`;
};

/**
 * Format ngày đầy đủ:
 * - "05 tháng 12 năm 2025"
 */
export const formatFullDate = (timestamp) => {
    const date = getVietnamDate(timestamp);
    if (!date) return '';

    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

/**
 * Format chỉ giờ:
 * - "14:35"
 */
export const formatTimeOnly = (timestamp) => {
    const date = getVietnamDate(timestamp);
    if (!date) return '';

    return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};

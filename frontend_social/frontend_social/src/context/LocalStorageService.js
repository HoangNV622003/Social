// utils/service/localStorageService.js

// Các key cố định – tránh hardcode rải rác khắp dự án
export const KEY_TOKEN = 'accessToken';
export const KEY_USER_ID = 'userId';
export const KEY_USER = 'userData'; // nếu bạn muốn lưu luôn object user vào localStorage (tùy chọn)

// Lấy token từ localStorage
export const getToken = () => {
    try {
        return localStorage.getItem(KEY_TOKEN);
    } catch (error) {
        console.error('Lỗi đọc token từ localStorage:', error);
        return null;
    }
};

// Lưu token
export const setToken = (token) => {
    try {
        if (token) {
            localStorage.setItem(KEY_TOKEN, token);
        } else {
            localStorage.removeItem(KEY_TOKEN);
        }
    } catch (error) {
        console.error('Lỗi lưu token:', error);
    }
};

// Xóa token
export const removeToken = () => {
    try {
        localStorage.removeItem(KEY_TOKEN);
    } catch (error) {
        console.error('Lỗi xóa token:', error);
    }
};

// Lấy userId
export const getUserId = () => {
    try {
        return localStorage.getItem(KEY_USER_ID);
    } catch (error) {
        console.error('Lỗi đọc userId:', error);
        return null;
    }
};

// Lưu userId
export const setUserId = (userId) => {
    try {
        if (userId) {
            localStorage.setItem(KEY_USER_ID, String(userId));
        } else {
            localStorage.removeItem(KEY_USER_ID);
        }
    } catch (error) {
        console.error('Lỗi lưu userId:', error);
    }
};

// Xóa userId
export const removeUserId = () => {
    try {
        localStorage.removeItem(KEY_USER_ID);
    } catch (error) {
        console.error('Lỗi xóa userId:', error);
    }
};

// (Tùy chọn) Lưu toàn bộ object user – hữu ích khi không muốn gọi lại API profile
export const setUser = (userData) => {
    try {
        if (userData) {
            localStorage.setItem(KEY_USER, JSON.stringify(userData));
        } else {
            localStorage.removeItem(KEY_USER);
        }
    } catch (error) {
        console.error('Lỗi lưu user data:', error);
    }
};

export const getUser = () => {
    try {
        const data = localStorage.getItem(KEY_USER);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Lỗi parse user data:', error);
        return null;
    }
};

export const removeUser = () => {
    try {
        localStorage.removeItem(KEY_USER);
    } catch (error) {
        console.error('Lỗi xóa user data:', error);
    }
};

// Hàm dọn sạch toàn bộ auth khi logout (gọn nhất)
export const clearAuthStorage = () => {
    removeToken();
    removeUserId();
    removeUser?.(); // nếu có hàm removeUser
};

// Export tất cả để dùng dễ dàng
export default {
    KEY_TOKEN,
    KEY_USER_ID,
    KEY_USER,

    getToken,
    setToken,
    removeToken,

    getUserId,
    setUserId,
    removeUserId,

    getUser,
    setUser,
    removeUser,

    clearAuthStorage
};
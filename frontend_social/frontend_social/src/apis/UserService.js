import axios from 'axios';
import { API_URL } from '../constants/apiConstants';

const USER_API = `${API_URL}/users`;

// Helper chung (giống hệt bạn đang dùng)
const authHeader = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// 1. Lấy thông tin profile của user hiện tại
export const getUserProfile = async (token) => {
    return await axios.get(`${USER_API}/profile`, authHeader(token));
};

// 2. Cập nhật profile (fullName, bio, phone, avatar, ...)
export const updateUserProfile = async (profileData, token) => {
    return await axios.put(`${USER_API}/profile`, profileData, authHeader(token));
};

// 3. Thay đổi mật khẩu
export const changePassword = async (passwordData, token) => {
    const payload = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
    };
    return await axios.put(`${USER_API}/change-password`, payload, authHeader(token));
};

// 4. Tạo user mới (đăng ký hoặc admin tạo)
// → Endpoint POST /api/users (không cần token nếu là đăng ký công khai)
//    Nếu chỉ admin được tạo thì vẫn cần token
export const createUser = async (userData, token = null) => {
    const config = token ? authHeader(token) : { headers: { 'Content-Type': 'application/json' } };
    return await axios.post(USER_API, userData, config);
};

// Bonus: Nếu bạn có refresh token hoặc logout thì thêm đây
// export const logout = async (token) => { ... }
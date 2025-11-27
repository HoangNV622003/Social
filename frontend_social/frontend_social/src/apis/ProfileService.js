import axios from 'axios';
import { API_URL } from '../constants/apiConstants';

// Base URL cho profile
const PROFILE_API = `${API_URL}/profile`;

// Helper thêm token
const authHeader = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Nếu bạn dùng form-data (upload ảnh)
const authHeaderMultipart = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
    }
});

// 1. Lấy profile của chính mình (main)
export const getMyProfile = async (token) => {
    return await axios.get(`${PROFILE_API}/main`, authHeader(token));
};

// 2. Lấy danh sách bạn bè của mình
export const getMyFriends = async (token) => {
    return await axios.get(`${PROFILE_API}/fr`, authHeader(token));
};

// 3. Lấy danh sách bạn bè của người khác theo username
export const getFriendsOfUser = async (username, token) => {
    return await axios.get(`${PROFILE_API}/${username}/friends`, authHeader(token));
};

// 4. Lấy bài post của người khác theo username
export const getPostsByUsername = async (username, token, page = 0, size = 10) => {
    return await axios.get(`${PROFILE_API}/${username}/posts`, {
        ...authHeader(token),
        params: { page, size }
    });
};

// 5. Lấy bài post của chính mình (có phân trang)
export const getMyPosts = async (token, page = 0, size = 10) => {
    return await axios.get(`${PROFILE_API}/post`, {
        ...authHeader(token),
        params: { page, size }
    });
};

// 6. Lấy thông tin profile người khác (có trạng thái friend, pending, request...)
export const getUserProfile = async (username, token) => {
    return await axios.get(`${PROFILE_API}/${username}`, authHeader(token));
};

// 7. Upload avatar (có xử lý file)
export const uploadAvatar = async (file, token) => {
    const formData = new FormData();
    formData.append('file', file);

    return await axios.post(`${PROFILE_API}/avatar`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            // Không set Content-Type, browser tự set + boundary
        }
    });
};
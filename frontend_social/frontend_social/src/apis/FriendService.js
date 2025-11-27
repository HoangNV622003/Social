// src/apis/FriendService.js (hoặc src/services/FriendService.js)
import axios from 'axios';
import { API_URL } from '../constants/apiConstants';

// Helper chuẩn: chỉ thêm Bearer ở đây, token truyền vào phải là thuần
const getAuthConfig = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`,  // ← chỉ thêm Bearer 1 lần
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export const addFriendRequest = async (username, accessToken) => {
    // Làm sạch token (phòng trường hợp frontend gửi có Bearer)
    const cleanToken = accessToken?.startsWith('Bearer ')
        ? accessToken.replace('Bearer ', '')
        : accessToken;

    console.log("Token đã làm sạch (FriendService):", cleanToken); // Debug

    return await axios.post(
        `${API_URL}/friend/add_friend`,  // URL
        null,                            // data = null (vì dùng params)
        {
            ...getAuthConfig(cleanToken),
            params: { username }
        }
    );
};

export const acceptFriendRequest = async (username, accessToken) => {
    const cleanToken = accessToken?.startsWith('Bearer ')
        ? accessToken.replace('Bearer ', '')
        : accessToken;

    return await axios.post(
        `${API_URL}/friend/accept`,
        null,
        {
            ...getAuthConfig(cleanToken),
            params: { username }
        }
    );
};

export const cancelFriendRequest = async (otherName, accessToken) => {
    const cleanToken = accessToken?.startsWith('Bearer ') ? accessToken.replace('Bearer ', '') : accessToken;

    // Lưu ý: cancel dùng PathVariable → phải dùng /cancel/{otherName}
    return await axios.post(
        `${API_URL}/friend/cancel/${otherName}`,  // ĐÚNG: dùng PathVariable
        null,
        getAuthConfig(cleanToken)
    );
};
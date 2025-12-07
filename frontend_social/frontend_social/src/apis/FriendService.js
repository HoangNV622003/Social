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

export const getFriend = async (userId, accessToken) => {
    return await axios.get(`${API_URL}/friend/${userId}`, { ...getAuthConfig(accessToken) })
}
export const getFriendRequest = async (accessToken) => {
    return await axios.get(`${API_URL}/friend/request`, { ...getAuthConfig(accessToken) })
}
export const addFriendRequest = async (userId, accessToken) => {

    return await axios.post(
        `${API_URL}/friend/add`, { userId },
        {
            ...getAuthConfig(accessToken)
        }
    );
};

export const acceptFriendRequest = async (userId, accessToken) => {
    return await axios.put(
        `${API_URL}/friend/${userId}/accept`,
        null,
        {
            ...getAuthConfig(accessToken)
        }
    );
};

export const cancelFriendRequest = async (userId, accessToken) => {
    return await axios.put(
        `${API_URL}/friend/${userId}/cancel`,  // ĐÚNG: dùng PathVariable
        null,
        getAuthConfig(accessToken)
    );
};

export const unfriend = async (userId, accessToken) => {
    console.log("token", accessToken)
    return await axios.delete(`${API_URL}/friend/${userId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,  // ← chỉ thêm Bearer 1 lần
            'Content-Type': 'application/json'
        }
    })
}

export const searchFriend = async (keyword, userId, accessToken) => {
    return await axios.get(
        `${API_URL}/friend/${userId}`,
        {
            ...getAuthConfig(accessToken),
            params: { keyword }
        }
    );
}
export const deleteFriendRequest = async (requestId, accessToken) => {
    return await axios.delete(`${API_URL}/friend/request/${requestId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,  // ← chỉ thêm Bearer 1 lần
            'Content-Type': 'application/json'
        }
    })
}
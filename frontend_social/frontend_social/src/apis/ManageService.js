// src/services/ManageService.js
import axios from 'axios';
import { API_URL } from '../constants/apiConstants';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // để gửi cookie nếu backend dùng session
});

// Tự động gắn token vào mọi request (nếu có)
api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getUserByUsername = async (username) => {
    const response = await api.get(`/manage/user/${username}`);
    return response.data;
};

export const updateUserByAdmin = async (username, payload, accessToken) => {
    const response = await axios.put(
        `${API_URL}/manage/update/${username}`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            withCredentials: true
        }
    );
    return response;
};

// Các hàm khác nếu cần...
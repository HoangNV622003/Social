// src/apis/StatisticService.js
import axios from 'axios';
import { API_URL } from '../constants/apiConstants';

// Base URLs
const STATISTIC_API = `${API_URL}/statistics`;
const POST_API = `${API_URL}/post`;

// Helper chung – tự động thêm Bearer token
const authHeader = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// ====================== THỐNG KÊ ======================

// 1. Tương tác (Like + Comment) theo tháng
export const getInteractionStats = async (token) => {
    return await axios.get(`${STATISTIC_API}/interaction`, authHeader(token));
};

// 2. Tin nhắn theo tháng
export const getMessageStats = async (token) => {
    return await axios.get(`${STATISTIC_API}/messages`, authHeader(token));
};

// 3. Người dùng theo địa chỉ
export const getUsersByAddressStats = async (token) => {
    return await axios.get(`${STATISTIC_API}/users-by-address`, authHeader(token));
};

// 4. Số bài viết theo tháng (dùng cho dashboard)
export const getPostStats = async (token) => {
    return await axios.get(`${POST_API}/all_p`, authHeader(token));
};
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

export const getStatistic = async (token, year) => {
    return await axios.get(`${STATISTIC_API}?year=${year}`, authHeader(token));
};
import { API_URL } from '../constants/apiConstants';
import axios from 'axios';
export const authenticateUser = async (payload) => {
    return await axios.post(`${API_URL}/authenticate`, payload, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const getProfile = async (token) => {
    return await axios.get(`${API_URL}/authenticate/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}
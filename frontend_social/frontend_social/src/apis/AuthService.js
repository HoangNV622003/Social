import { API_URL } from '../constants/apiConstants';
import axios from 'axios';
export const authenticateUser = async (payload) => {
    return await axios.post(`${API_URL}/authenticate`, payload, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
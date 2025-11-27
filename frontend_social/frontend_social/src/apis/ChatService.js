// apis/ChatService.js
import axios from 'axios';
import { API_URL } from '../constants/apiConstants';

const CHAT_API = `${API_URL}/chats`;

const authHeader = (token) => ({
    headers: { 'Authorization': `Bearer ${token}` }
});

export const getAllChats = async (token) => {
    return await axios.get(CHAT_API, authHeader(token));
};

export const addToChat = async (receiverUsername, token) => {
    return await axios.post(`${CHAT_API}/createChat/${receiverUsername}`, {}, authHeader(token));
};

export const deleteChat = async (chatId, token) => {
    return await axios.delete(`${CHAT_API}/delete/${chatId}`, authHeader(token));
};

export const getAllMessage = async (chatId, page = 0, size = 20, token) => {
    return await axios.get(`${CHAT_API}/${chatId}`, {
        ...authHeader(token),
        params: { page, size }
    });
};
import { API_URL } from '../constants/apiConstants';
import axios from 'axios';
const COMMENT_API = `${API_URL}/comments`;

// Helper chung – thêm Bearer token
const authHeader = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// TẠO BÌNH LUẬN MỚI
export const createComment = async (token, postId, content) => {
    const payload = {
        postId: postId,
        content: content.trim()
    };

    return await axios.post(COMMENT_API, payload, authHeader(token));
};
import { API_URL } from '../constants/apiConstants';
import axios from 'axios';
const COMMENT_API = `${API_URL}/post/`;

// Helper chung – thêm Bearer token
const authHeader = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// TẠO BÌNH LUẬN MỚI
export const createComment = async (token, postId, formData) => {
    return await axios.post(COMMENT_API + postId + "/comments", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};
export const getCommentsByPostId = async (postId, token) => {
    return await axios.get(COMMENT_API + postId + "/comments", authHeader(token))
}
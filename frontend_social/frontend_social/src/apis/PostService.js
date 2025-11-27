// apis/PostService.js
import axios from 'axios';
import { API_URL } from '../constants/apiConstants';

const POST_API = `${API_URL}/post`;

// Helper chung – tự động thêm Bearer token
const authHeader = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// 1. Lấy tất cả bài post (mình + bạn bè)
export const getAllPosts = async (token) => {
    return await axios.get(`${POST_API}/all`, authHeader(token));
};

// 2. Lấy bài post bạn bè (phân trang)
export const getPostsByFriends = async (token, page = 0, size = 7) => {
    return await axios.get(`${POST_API}/postByFriend`, {
        ...authHeader(token),
        params: { page, size }
    });
};

// 3. Like / Unlike
export const likePost = async (token, postId) => {
    return await axios.post(
        `${POST_API}/like`,
        null,
        { ...authHeader(token), params: { postId } }
    );
};

// 4. Lấy chi tiết 1 bài
export const getPostById = async (token, postId) => {
    return await axios.get(`${POST_API}/${postId}`, authHeader(token));
};

// 5. Cập nhật bài post
export const updatePost = async (token, postId, postData) => {
    return await axios.put(
        `${POST_API}/update/${postId}`,
        postData,
        authHeader(token)
    );
};

// TẠO BÀI VIẾT MỚI (có ảnh + nội dung)
export const createPost = async (token, content, file = null) => {
    const formData = new FormData();
    formData.append('content', content);
    if (file) {
        formData.append('file', file);
    }

    return await axios.post(`${POST_API}/create`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
};

// XÓA BÀI VIẾT
export const deletePost = async (token, postId) => {
    return await axios.delete(`${POST_API}/delete/${postId}`, authHeader(token));
};
// 7. Lấy số liệu thống kê bài viết theo tháng (dùng cho dashboard)
export const getPostStats = async (token) => {
    return await axios.get(`${POST_API}/all_p`, authHeader(token));
};
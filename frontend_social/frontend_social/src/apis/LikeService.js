import { API_URL } from '../constants/apiConstants';
import axios from 'axios';
const LiKE_API = API_URL + "/likes"
const authHeader = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// TẠO BÌNH LUẬN MỚI
export const toggleLike = async (token, postId) => {
    const payload = {
        postId: postId,
    };
    return await axios.post(LiKE_API, payload, authHeader(token));
};
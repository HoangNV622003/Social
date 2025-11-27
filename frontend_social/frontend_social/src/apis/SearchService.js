import axios from 'axios';
import { API_URL } from '../constants/apiConstants';

const SEARCH_API = `${API_URL}/search`;

// Helper thêm token
const authHeader = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

/**
 * Tìm kiếm người dùng theo từ khóa
 * @param {string} keyword - Từ khóa tìm kiếm (username, email)
 * @param {string} token - Access token
 * @param {number} page - Trang (mặc định 0)
 * @param {number} size - Số kết quả mỗi trang (mặc định 7)
 * @returns {Promise} - Danh sách người dùng + trạng thái kết bạn
 */
export const searchUsers = async (keyword = "", token, page = 0, size = 7) => {
    // Nếu keyword rỗng hoặc chỉ có khoảng trắng → trả về mảng rỗng (tránh gọi API vô ích)

    try {
        const response = await axios.get(SEARCH_API, {
            ...authHeader(token),
            params: {
                keyword: keyword.trim(),
                page,
                size
            }
        });

        // Backend trả về List<SearchDTO> → không có thông tin phân trang đầy đủ
        // Nhưng ta vẫn có thể giả lập một chút để dễ dùng
        return {
            data: response.data,
            isFirstPage: page === 0,
            isLastPage: response.data.length < size, // Ước lượng
            currentPage: page,
            hasMore: response.data.length === size
        };
    } catch (error) {
        console.error("Lỗi tìm kiếm:", error.response?.data || error.message);
        throw error;
    }
};
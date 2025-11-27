import axios from 'axios';
import { API_URL } from '../constants/apiConstants';

const REPORT_API = `${API_URL}/reports`;

// Helper thêm token + headers
const authHeader = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// 1. Báo cáo một bài viết (dành cho người dùng thường)
export const reportPost = async (postId, reason, token) => {
    const payload = {
        postId,
        reason
    };

    return await axios.post(`${REPORT_API}/report`, payload, authHeader(token));
};

// 2. Lấy danh sách tất cả báo cáo (phân trang) – Dành cho Admin
export const getAllReports = async (token, page = 0, size = 5) => {
    return await axios.get(REPORT_API, {
        ...authHeader(token),
        params: { page, size }
    });
};

// 3. Xóa bài viết bị báo cáo (và thông báo cho tác giả + người báo cáo) – Admin
export const deleteReportedPost = async (postId, token) => {
    return await axios.delete(`${REPORT_API}/delete/${postId}`, authHeader(token));
};

// 4. Bỏ qua / xóa báo cáo (không xóa bài viết) – Admin
export const ignoreReport = async (reportId, token) => {
    return await axios.delete(`${REPORT_API}/ignore/${reportId}`, authHeader(token));
};
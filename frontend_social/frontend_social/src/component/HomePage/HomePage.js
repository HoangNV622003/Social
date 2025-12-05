// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import PostList from '../Post/PostList';
import { getAllPosts } from '../../apis/PostService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './HomePage.css';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import UserAvatar from '../UserAvatar/UserAvatar';

const HomePage = () => {
    const { token, user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

    // Hàm tải bài viết – ĐẢM BẢO GỌI LẠI SAU KHI ĐĂNG BÀI
    const fetchPosts = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await getAllPosts(token, null, 0, 20);
            setPosts(res.data.content || []);
        } catch (err) {
            console.error('Lỗi tải bài viết:', err);
            toast.error('Không thể tải bài viết');
        } finally {
            setLoading(false);
        }
    };

    // Gọi lần đầu khi mount
    useEffect(() => {
        if (token) {
            fetchPosts();
        } else {
            setError('Bạn cần đăng nhập');
            setLoading(false);
        }
    }, [token]);

    // Nếu chưa đăng nhập
    if (!token) {
        return (
            <div className="home-page">
                <Navbar />
                <div className="auth-required">
                    <h2>Bạn cần đăng nhập để xem nội dung</h2>
                    <button onClick={() => window.location.href = '/'}>
                        Đi tới Đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="home-page">
            <Navbar />
            <div className="home-content">
                <div className="feed-container">
                    {/* Thanh tạo bài */}
                    <div
                        className="create-post-bar"
                        onClick={() => setIsCreatePostOpen(true)}
                    >
                        <UserAvatar username={user?.username} image={user?.image} size="medium" />
                        <div className="input-placeholder">Bạn đang nghĩ gì thế?</div>
                    </div>

                    {/* Modal tạo bài – truyền đúng callback */}
                    <CreatePostModal
                        isOpen={isCreatePostOpen}
                        onClose={() => setIsCreatePostOpen(false)}
                        onPostCreated={() => {
                            // Đây là chỗ quyết định bài mới có hiện hay không!
                            fetchPosts(); // ← GỌI LẠI API LẤY DANH SÁCH MỚI NHẤT
                        }}
                    />

                    {/* Danh sách bài viết */}
                    {loading ? (
                        <div className="loading">Đang tải bài viết...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : (
                        <PostList posts={posts} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
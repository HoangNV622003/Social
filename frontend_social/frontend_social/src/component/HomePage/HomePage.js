// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import PostList from '../Post/PostList';
import { getAllPosts } from '../../apis/PostService';
import { useAuth } from '../../context/AuthContext'; // Đường dẫn đúng của bạn
import './HomePage.css';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import UserAvatar from '../UserAvatar/UserAvatar';

const HomePage = () => {
    const { token, user } = useAuth(); // Lấy token và user
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    useEffect(() => {
        if (!token) {
            setError('Bạn cần đăng nhập để xem bài viết');
            setLoading(false);
            return;
        }

        const fetchPosts = async () => {
            try {
                const res = await getAllPosts(token, null, 0, 20); // Truyền token vào
                setPosts(res.data.content || []);
                setLoading(false);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                } else {
                    setError('Không thể tải bài viết');
                }
                setLoading(false);
            }
        };

        fetchPosts();
    }, [token]);

    // Nếu chưa đăng nhập
    if (!token) {
        return (
            <div className="home-page">
                <Navbar />
                <div className="feed-container">
                    <div className="auth-required">
                        <h2>Bạn cần đăng nhập để xem nội dung</h2>
                        <button onClick={() => window.location.href = '/'}>
                            Đi tới Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="home-page">
            <Navbar />
            <div className="home-content">
                <div className="feed-container">
                    {loading && (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Đang tải bài viết...</p>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    {!loading && !error && <>
                        <div
                            className={`create-post-bar ${isCreatePostOpen ? 'active' : ''}`}
                            onClick={() => setIsCreatePostOpen(true)}
                        >
                            <UserAvatar username={user.username} image={user.image} size="medium" />
                            <div className="input-placeholder">
                                Bạn đang nghĩ gì thế?
                            </div>
                        </div>

                        {/* Modal tạo bài viết */}
                        <CreatePostModal
                            isOpen={isCreatePostOpen}
                            onClose={() => setIsCreatePostOpen(false)}
                        />
                        <PostList posts={posts} />
                    </>}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
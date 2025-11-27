import React, { useState, useEffect, useCallback } from 'react';
import Post from './post.js';
import './Blockchat.css';
import Navbar from '../Navbar/Navbar.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    getPostsByFriends,
    getAllPosts,
    createPost,
    deletePost
} from '../../apis/PostService.js';
import { toast } from 'react-toastify';

function Blockchat() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [useAllPosts, setUseAllPosts] = useState(false);

    const { token } = useAuth();
    const navigate = useNavigate();

    const [showCreatePost, setShowCreatePost] = useState(false);
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // === TẢI BÀI VIẾT ===
    const fetchPosts = useCallback(async () => {
        if (!token || isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            let response;
            if (!useAllPosts) {
                response = await getPostsByFriends(token, page, 7);
            } else {
                response = await getAllPosts(token);
                const allData = response.data || [];
                setPosts(prev => {
                    const map = new Map(prev.map(p => [p.id, p]));
                    allData.forEach(p => map.set(p.id, p));
                    return Array.from(map.values());
                });
                setHasMore(false);
                return;
            }

            const newPosts = response.data?.content || response.data || [];

            if (newPosts.length === 0 && !useAllPosts && page === 0) {
                setUseAllPosts(true);
                setPage(0);
                return;
            }

            setPosts(prev => {
                const map = new Map(prev.map(p => [p.id, p]));
                newPosts.forEach(post => map.set(post.id, post));
                return Array.from(map.values());
            });

            setHasMore(newPosts.length >= 7);
        } catch (error) {
            console.error('Lỗi tải bài viết:', error);
            toast.error('Không thể tải bài viết');
        } finally {
            setIsLoading(false);
        }
    }, [token, page, useAllPosts]);

    useEffect(() => {
        if (token) fetchPosts();
    }, [page, useAllPosts, token]);

    // === INFINITE SCROLL ===
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 200 >=
                document.documentElement.scrollHeight
            ) {
                if (!isLoading && hasMore && !useAllPosts) {
                    setPage(prev => prev + 1);
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore, useAllPosts]);

    // === TẠO BÀI VIẾT MỚI – DÙNG SERVICE ===
    const handleCreatePost = async (e) => {
        e?.preventDefault();
        if (!content.trim()) return toast.warn('Nội dung không được để trống!');

        try {
            const response = await createPost(token, content, file);

            if (response.data.success) {
                toast.success('Đăng bài thành công!');

                // Thêm bài mới vào đầu danh sách (realtime)
                const newPost = response.data.post || response.data;
                setPosts(prev => [newPost, ...prev]);

                // Reset form
                setContent('');
                setFile(null);
                setPreview(null);
                setShowCreatePost(false);
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Đăng bài thất bại';
            toast.error(msg);
        }
    };

    // === XÓA BÀI VIẾT – DÙNG SERVICE (truyền vào Post component) ===
    const handleDeletePost = async (postId) => {
        if (!window.confirm('Xóa bài viết này?')) return;

        try {
            await deletePost(token, postId);
            toast.success('Đã xóa bài viết');
            setPosts(prev => prev.filter(p => p.id !== postId));
        } catch (err) {
            toast.error('Không thể xóa bài viết');
        }
    };

    // === XỬ LÝ ẢNH PREVIEW ===
    const handleFileChange = (e) => {
        const f = e.target.files[0];
        setFile(f);
        setPreview(f ? URL.createObjectURL(f) : null);
    };

    return (
        <div className='main-container'>
            <Navbar />

            {/* Form tạo bài viết */}
            <div className="createPost-container">
                <button className='open-btn' onClick={() => setShowCreatePost(v => !v)}>
                    {showCreatePost ? 'Đóng' : 'Chia sẻ bài viết'}
                </button>

                {showCreatePost && (
                    <form className="createPost-box" onSubmit={handleCreatePost}>
                        <textarea
                            placeholder="Bạn đang nghĩ gì?"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows="4"
                            required
                        />
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {preview && (
                            <div className="image-preview">
                                <img src={preview} alt="Preview" />
                                <button type="button" onClick={() => { setFile(null); setPreview(null); }}>
                                    ×
                                </button>
                            </div>
                        )}
                        <div className="button-group">
                            <button type="submit">Đăng ngay</button>
                            <button type="button" onClick={() => {
                                setContent(''); setFile(null); setPreview(null);
                            }}>
                                Xóa hết
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Danh sách bài viết */}
            <div className="blockchat-container">
                {posts.map(post => (
                    <Post
                        key={post.id}
                        {...post}
                        isOwner={post.createdBy === localStorage.getItem('username')}
                        onDelete={handleDeletePost}  // Truyền callback xóa
                    />
                ))}

                {isLoading && (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                )}

                {!hasMore && posts.length > 0 && !isLoading && (
                    <div className="text-center py-4 text-muted">
                        Đã hết bài viết để xem
                    </div>
                )}

                {posts.length === 0 && !isLoading && (
                    <div className="text-center py-5 text-muted">
                        <h5>Chưa có bài viết nào</h5>
                        <p>Hãy là người đầu tiên chia sẻ!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Blockchat;
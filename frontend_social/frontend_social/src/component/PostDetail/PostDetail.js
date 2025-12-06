// src/pages/PostDetail/PostDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../UserAvatar/UserAvatar';
import CommentSection from './CommentSection';
import { getPostById } from '../../apis/PostService';
import { createComment } from '../../apis/CommentService';
import { toggleLike } from '../../apis/LikeService';
import { IMAGE_SERVER_URL } from '../../constants/CommonConstants';
import { toast } from 'react-toastify';
import { FiImage } from "react-icons/fi";
import { SlLike } from 'react-icons/sl';
import { GoComment } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import { VscSend } from "react-icons/vsc";

import './PostDetail.css';

const PostDetail = () => {
    const { postId } = useParams();
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    // Comment states
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [sending, setSending] = useState(false);
    const [commentTrigger, setCommentTrigger] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await getPostById(postId, token);
                setPost(res.data);
            } catch (err) {
                toast.error("Không tải được bài viết");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId, token]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!content.trim() && !image) return;

        setSending(true);
        try {
            const formData = new FormData();
            formData.append('content', content.trim());
            if (image) formData.append('file', image);

            await createComment(token, postId, formData);
            toast.success('Đã đăng bình luận!');

            setContent('');
            setImage(null);
            setImagePreview(null);
            setCommentTrigger(prev => prev + 1);
        } catch (err) {
            toast.error('Gửi bình luận thất bại');
        } finally {
            setSending(false);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleLike = async () => {
        if (!post) return;
        try {
            await toggleLike(token, postId);
            setPost(prev => ({
                ...prev,
                isLiked: !prev.isLiked,
                totalLike: prev.isLiked ? prev.totalLike - 1 : prev.totalLike + 1
            }));
        } catch (err) {
            toast.error("Lỗi khi thích bài viết");
        }
    };

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (!post) return <div>Bài viết không tồn tại</div>;

    return (
        <div className="post-detail-container">

            {/* NÚT THOÁT - GÓC TRÁI TRÊN */}
            <button onClick={handleGoBack} className="btn-back">
                <CiLogout />
            </button>

            {/* ẢNH LỚN - 70% - CỐ ĐỊNH */}
            <div className="post-detail-left">
                <img src={IMAGE_SERVER_URL + post.image} alt="post" />
            </div>

            {/* NỘI DUNG + BÌNH LUẬN - 30% */}
            <div className="post-detail-right">

                {/* Header tác giả */}
                <div className="post-detail-author">
                    <UserAvatar username={post.author.username} image={post.author.image} size="medium" />
                    <div className="user-info">
                        <h3>{post.author.username}</h3>
                    </div>
                </div>

                {/* Nội dung bài viết */}
                <div className="post-detail-content">
                    {post.content}
                </div>

                {/* LIKE + COMMENT + SỐ LƯỢT THÍCH */}
                <div className="post-action">
                    <button
                        onClick={handleLike}
                        className={`like-btn ${post.isLiked ? 'liked' : ''}`}
                    >
                        <SlLike className="icon-like" />
                    </button>

                    <button className="comment-btn">
                        <GoComment className="icon-comment" />
                    </button>

                    <div className="like-count">
                        {post.totalLike > 0 ? `${post.totalLike} lượt thích` : 'Chưa có lượt thích nào'}
                    </div>
                </div>

                {/* Danh sách bình luận */}
                <div className="port-detail-comment">
                    <CommentSection postId={postId} onNewComment={commentTrigger} />
                </div>

                {/* Ô VIẾT BÌNH LUẬN DÍNH ĐÁY */}
                <div className="comment-form-wrapper">
                    <form onSubmit={handleSubmitComment}>
                        <div className="comment-input-container">

                            <div className="comment-input-wrapper">
                                {user && (
                                    <UserAvatar username={user.username} image={user.image} size="small" />
                                )}

                                <input
                                    type="text"
                                    placeholder="Thêm bình luận..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={sending}
                                />

                                <div className="comment-tools">
                                    <label className="tool-btn">
                                        <FiImage />
                                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                                    </label>

                                    <button
                                        type="submit"
                                        className="send-text"
                                        disabled={sending || (!content.trim() && !image)}
                                    >
                                        <VscSend />

                                    </button>
                                </div>
                            </div>

                            {/* Preview ảnh nổi lên trên */}
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Preview" />
                                    <button type="button" onClick={removeImage}>×</button>
                                </div>
                            )}

                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default PostDetail;
// src/components/post/UserPost.jsx (hoặc đường dẫn của bạn)
import React, { useState, useEffect, useRef } from "react";
import "./User_post.css";
import { useAuth } from '../../context/AuthContext';
import { likePost, updatePost, deletePost } from '../../apis/PostService';
import { createComment } from '../../apis/CommentService';
import { toast } from 'react-toastify';
import timeAgo from '../../Ago'; // nếu bạn dùng timeAgo

function UserPost({
    id,
    content,
    image,
    png,
    createdBy,
    createdAt,
    likesCount = 0,
    comments = { content: [] },
    liked = false,
    onDelete,
    onEdit
}) {
    const { token } = useAuth();
    const currentUsername = localStorage.getItem('username') || 'Bạn';

    const [isLiked, setIsLiked] = useState(liked);
    const [likeCount, setLikeCount] = useState(likesCount);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentsList, setCommentsList] = useState(comments?.content || []);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(content);

    const commentInputRef = useRef(null);

    // Click outside dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".dropdown-container")) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Focus ô nhập bình luận
    useEffect(() => {
        if (showComments && commentInputRef.current) {
            setTimeout(() => commentInputRef.current.focus(), 100);
        }
    }, [showComments]);

    // === LIKE ===
    const toggleLike = async () => {
        if (!token) return;
        try {
            const res = await likePost(token, id);
            setIsLiked(res.data.isLiked);
            setLikeCount(res.data.likeCounts);
        } catch (err) {
            toast.error("Lỗi khi thích bài viết");
        }
    };

    // === BÌNH LUẬN ===
    const handleAddComment = async () => {
        if (!newComment.trim() || !token) return;

        try {
            const response = await createComment(token, id, newComment.trim());
            const comment = response.data;

            setCommentsList(prev => [{
                username: currentUsername,
                content: comment.content || newComment.trim()
            }, ...prev]);

            setNewComment("");
            toast.success("Đã đăng bình luận!");
        } catch (err) {
            toast.error("Không thể gửi bình luận");
        }
    };

    // === XÓA BÀI ===
    const handleDeletePost = async () => {
        if (!window.confirm("Xóa bài viết này?")) return;
        try {
            await deletePost(token, id);
            toast.success("Đã xóa bài viết!");
            onDelete?.(id);
        } catch (err) {
            toast.error("Xóa thất bại");
        }
    };

    // === CHỈNH SỬA ===
    const handleEditPost = async () => {
        if (!updatedContent.trim()) return toast.warn("Nội dung không được để trống!");

        try {
            const res = await updatePost(token, id, updatedContent.trim());
            toast.success("Đã cập nhật bài viết!");
            onEdit?.(id, res.data);
            setShowEditModal(false);
        } catch (err) {
            toast.error("Cập nhật thất bại");
        }
    };

    // === AN TOÀN CHO createdBy ===
    const displayName = createdBy || currentUsername || "Người dùng";
    const avatarLetter = displayName.charAt(0).toUpperCase();
    const imageSrc = image ? `data:image/png;base64,${image}` : png ? `data:image/png;base64,${png}` : null;

    return (
        <div className="post-container">
            {/* Header */}
            <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: '#e4e6eb', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 'bold', color: '#1877f2'
                    }}>
                        {avatarLetter}
                    </div>
                    <div>
                        <strong>{displayName}</strong>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#65676b' }}>
                            {timeAgo ? timeAgo(createdAt) : new Date(createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Dropdown */}
                <div className="dropdown-container">
                    <button className="dropdown-toggle" onClick={() => setShowDropdown(prev => !prev)}>
                        ⋮
                    </button>
                    {showDropdown && (
                        <ul className="dropdown-menu show">
                            <li onClick={() => { setShowEditModal(true); setShowDropdown(false); }}>Edit</li>
                            <li onClick={handleDeletePost}>Delete</li>
                        </ul>
                    )}
                </div>
            </div>

            {/* Nội dung */}
            <p className="post-content">{content}</p>

            {/* Ảnh */}
            {imageSrc && (
                <img src={imageSrc} alt="Post" className="post-image" style={{ width: '100%', borderRadius: '12px', margin: '12px 0' }} />
            )}

            {/* Thống kê */}
            <div style={{ padding: '8px 0', fontSize: '14px', color: '#65676b', display: 'flex', justifyContent: 'space-between' }}>
                <span>{likeCount} lượt thích</span>
                <span
                    onClick={() => setShowComments(true)}
                    style={{ color: '#1877f2', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {commentsList.length} bình luận
                </span>
            </div>

            {/* Nút hành động */}
            <div className="post-icons" style={{ borderTop: '1px solid #e4e6eb', paddingTop: '8px', display: 'flex', gap: '24px' }}>
                <div
                    onClick={toggleLike}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: isLiked ? '#1877f2' : '#606770' }}
                >
                    <img
                        src={require(`../../assets/images/${isLiked ? "heart.png" : "like.png"}`)}
                        alt="Like"
                        style={{ width: '24px', height: '24px' }}
                    />
                    <span style={{ fontWeight: isLiked ? '600' : '500' }}>Thích</span>
                </div>

                <div
                    onClick={() => setShowComments(true)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#606770' }}
                >
                    <img src={require("../../assets/images/cmt.png")} alt="Comment" style={{ width: '24px', height: '24px' }} />
                    <span>Bình luận</span>
                </div>
            </div>

            {/* Bình luận */}
            {showComments && (
                <div className="comments-section" style={{ marginTop: '12px', borderTop: '1px solid #e4e6eb', paddingTop: '12px' }}>
                    {commentsList.length > 0 ? (
                        commentsList.map((c, i) => (
                            <div key={i} className="comment" style={{ marginBottom: '12px' }}>
                                <p>
                                    <strong>{c.username || 'Bạn'}</strong>: {c.content}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#65676b', fontStyle: 'italic' }}>Chưa có bình luận nào</p>
                    )}

                    <div className="add-comment" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <input
                            ref={commentInputRef}
                            type="text"
                            placeholder="Viết bình luận..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                            style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc' }}
                        />
                        <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            style={{
                                padding: '8px 16px',
                                background: '#1877f2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                cursor: newComment.trim() ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}

            {/* Modal chỉnh sửa */}
            {showEditModal && (
                <div className="modal" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content" style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '500px', maxWidth: '90%' }}>
                        <h3>Chỉnh sửa bài viết</h3>
                        <textarea
                            value={updatedContent}
                            onChange={(e) => setUpdatedContent(e.target.value)}
                            rows={6}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', margin: '12px 0' }}
                        />
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={handleEditPost} style={{ padding: '10px 20px', background: '#1877f2', color: 'white', border: 'none', borderRadius: '8px' }}>
                                Lưu
                            </button>
                            <button onClick={() => setShowEditModal(false)} style={{ padding: '10px 20px', background: '#e4e6eb', border: 'none', borderRadius: '8px' }}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserPost;
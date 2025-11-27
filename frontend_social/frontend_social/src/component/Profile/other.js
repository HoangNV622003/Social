// src/components/profile/PostOther.jsx
import React, { useState, useEffect, useRef } from 'react';
import timeAgo from '../../Ago';
import { useAuth } from '../../context/AuthContext';
import { likePost, updatePost, deletePost } from '../../apis/PostService';
import { createComment } from '../../apis/CommentService';
import { toast } from 'react-toastify';
import './Post.css';

// === ICONS ===
const LikeIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill={filled ? "#0866ff" : "none"} stroke={filled ? "#0866ff" : "#606770"} strokeWidth="2">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const CommentIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#606770" strokeWidth="2">
    <path d="M21 6h-2v9h-9v2c0 .55.45 1 1 1h7l4 4v-13c0-1.1-.9-2-2-2zM15 12V3c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v14l4-4h8c1.1 0 2-.9 2-2z" />
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#606770">
    <circle cx="5" cy="12" r="2.5" />
    <circle cx="12" cy="12" r="2.5" />
    <circle cx="19" cy="12" r="2.5" />
  </svg>
);

function PostOther({
  id,
  content,
  image,
  png,
  createdBy,
  createdAt,
  likesCount = 0,
  comments = { content: [] },
  liked = false,
  isOwner = false,
  onDelete,
  onEdit
}) {
  const { token } = useAuth();
  const currentUsername = localStorage.getItem('username') || 'Bạn';

  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likesCount);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentsList, setCommentsList] = useState(comments?.content || []);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(content);

  const dropdownRef = useRef(null);
  const commentInputRef = useRef(null);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus ô nhập khi mở bình luận
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
      toast.error('Lỗi khi thích bài viết');
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
        content: comment.content || newComment.trim(),
        createdAt: comment.createdAt || new Date().toISOString()
      }, ...prev]);

      setNewComment('');
      toast.success('Đã đăng bình luận!');
    } catch (err) {
      toast.error('Không thể gửi bình luận');
    }
  };

  // === XÓA BÀI ===
  const handleDelete = async () => {
    if (!window.confirm('Xóa bài viết này?')) return;
    try {
      await deletePost(token, id);
      toast.success('Đã xóa bài viết!');
      onDelete?.(id);
    } catch (err) {
      toast.error('Xóa thất bại');
    }
  };

  // === CHỈNH SỬA BÀI ===
  const handleEdit = async () => {
    if (!updatedContent.trim()) return toast.warn('Nội dung không được để trống!');
    try {
      const res = await updatePost(token, id, updatedContent.trim());
      toast.success('Đã cập nhật bài viết!');
      onEdit?.(id, res.data);
      setShowEditModal(false);
    } catch (err) {
      toast.error('Cập nhật thất bại');
    }
  };

  // === AN TOÀN CHO createdBy ===
  const displayName = createdBy || currentUsername || 'Người dùng';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const imageSrc = image ? `data:image/png;base64,${image}` : png ? `data:image/png;base64,${png}` : null;

  return (
    <article className="blockchat-profile-2025-post">
      <div className="blockchat-profile-2025-post-header">
        <div className="blockchat-profile-2025-post-author">
          <div className="blockchat-profile-2025-post-avatar">
            {avatarLetter}
          </div>
          <div>
            <h4 className="blockchat-profile-2025-post-username">{displayName}</h4>
            <span className="blockchat-profile-2025-post-time">{timeAgo(createdAt)}</span>
          </div>
        </div>

        {isOwner && (
          <div className="blockchat-profile-2025-post-options" ref={dropdownRef}>
            <button onClick={() => setShowDropdown(!showDropdown)} className="blockchat-profile-2025-options-btn">
              <MoreIcon />
            </button>
            {showDropdown && (
              <div className="blockchat-profile-2025-dropdown">
                <button onClick={() => { setShowEditModal(true); setShowDropdown(false); }}>Chỉnh sửa</button>
                <button onClick={handleDelete} className="blockchat-profile-2025-delete">Xóa bài viết</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="blockchat-profile-2025-post-content">
        <p>{content}</p>
      </div>

      {imageSrc && (
        <img src={imageSrc} alt="Post" className="blockchat-profile-2025-post-image" />
      )}

      {/* BẤM VÀO "X BÌNH LUẬN" → MỞ CỬA SỔ */}
      <div className="blockchat-profile-2025-post-stats">
        <span>{likeCount} lượt thích</span>
        <span
          onClick={() => setShowComments(true)}
          style={{
            color: '#1877f2',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'underline',
            marginLeft: '20px'
          }}
        >
          {commentsList.length} bình luận
        </span>
      </div>

      <div className="blockchat-profile-2025-post-actions">
        <button onClick={toggleLike} className={`blockchat-profile-2025-action-btn ${isLiked ? 'liked' : ''}`}>
          <LikeIcon filled={isLiked} />
          Thích
        </button>
        <div
          onClick={() => setShowComments(true)}
          className="blockchat-profile-2025-action-btn"
          style={{ cursor: 'pointer' }}
        >
          <CommentIcon />
          Bình luận
        </div>
      </div>

      {/* BÌNH LUẬN */}
      {showComments && (
        <div className="blockchat-profile-2025-comments">
          <div className="blockchat-profile-2025-comment-input">
            <input
              ref={commentInputRef}
              type="text"
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
            />
            <button onClick={handleAddComment} disabled={!newComment.trim()}>Gửi</button>
          </div>
          {commentsList.map((c, i) => (
            <div key={i} className="blockchat-profile-2025-comment-item">
              <strong>{c.username || 'Bạn'}</strong>: {c.content}
            </div>
          ))}
        </div>
      )}

      {/* MODAL CHỈNH SỬA */}
      {showEditModal && (
        <div className="blockchat-profile-2025-modal">
          <div className="blockchat-profile-2025-modal-content">
            <h3>Chỉnh sửa bài viết</h3>
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              rows="5"
            />
            <div className="blockchat-profile-2025-modal-actions">
              <button onClick={handleEdit}>Lưu</button>
              <button onClick={() => setShowEditModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default PostOther;
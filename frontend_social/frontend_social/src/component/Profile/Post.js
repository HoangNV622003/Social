import React, { useState, useEffect, useRef } from 'react';
import timeAgo from '../../Ago.js';
import { useAuth } from '../../context/AuthContext';
import { likePost } from '../../apis/PostService';
import { createComment } from '../../apis/CommentService';
import { reportPost } from '../../apis/ReportedPostService';
import { toast } from 'react-toastify';
import './Post.css';

// === SVG ICONS ===
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

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

function Post({
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
  const [showReportInput, setShowReportInput] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const dropdownRef = useRef(null);
  const commentInputRef = useRef(null);

  // Click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setShowReportInput(false);
        setReportReason('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tự động focus vào ô bình luận khi mở
  useEffect(() => {
    if (showComments && commentInputRef.current) {
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  }, [showComments]);

  // === LIKE ===
  const toggleLike = async () => {
    if (!token || isLiking) return;
    setIsLiking(true);
    try {
      const res = await likePost(token, id);
      setIsLiked(res.data.isLiked);
      setLikeCount(res.data.likeCounts);
    } catch (err) {
      toast.error('Lỗi khi thích bài viết');
    } finally {
      setIsLiking(false);
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
        content: comment.content,
        createdAt: comment.createdAt || new Date().toISOString()
      }, ...prev]);

      setNewComment('');
      toast.success('Đã đăng bình luận!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể gửi bình luận');
    }
  };

  // === BÁO CÁO ===
  const handleReport = async () => {
    if (!reportReason.trim()) return toast.warn('Vui lòng nhập lý do');
    try {
      await reportPost(id, reportReason.trim(), token);
      toast.success('Đã gửi báo cáo thành công!');
      setShowDropdown(false);
      setShowReportInput(false);
      setReportReason('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gửi báo cáo thất bại');
    }
  };

  // === AN TOÀN CHO createdBy ===
  const displayName = createdBy || currentUsername || 'Người dùng';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  // === ẢNH ===
  const imageSrc = image ? `data:image/png;base64,${image}` : png ? `data:image/png;base64,${png}` : null;

  return (
    <>
      <article className="fb-post-2025-container">
        <div className="fb-post-2025-header">
          <div className="fb-post-2025-author">
            <div className="fb-post-2025-avatar">{avatarLetter}</div>
            <div>
              <h4 className="fb-post-2025-name">{displayName}</h4>
              <span className="fb-post-2025-time">{timeAgo(createdAt)}</span>
            </div>
          </div>

          <div className="fb-post-2025-options" ref={dropdownRef}>
            <button onClick={() => setShowDropdown(!showDropdown)} className="fb-post-2025-options-btn">
              <MoreIcon />
            </button>

            {showDropdown && (
              <div className="fb-post-2025-dropdown">
                {isOwner ? (
                  <>
                    <button className="fb-post-2025-menu-item" onClick={() => onEdit?.({ id, content })}>Chỉnh sửa</button>
                    <button className="fb-post-2025-menu-item text-danger" onClick={() => onDelete?.(id)}>Xóa bài viết</button>
                  </>
                ) : (
                  !showReportInput ? (
                    <button className="fb-post-2025-menu-item" onClick={() => setShowReportInput(true)}>Báo cáo bài viết</button>
                  ) : (
                    <div className="fb-post-2025-report-box">
                      <textarea
                        placeholder="Lý do báo cáo..."
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="fb-post-2025-report-input"
                        rows="3"
                        autoFocus
                      />
                      <div className="fb-post-2025-report-buttons">
                        <button onClick={() => { setShowReportInput(false); setReportReason(''); }}>Hủy</button>
                        <button onClick={handleReport} className="fb-post-2025-send-report" disabled={!reportReason.trim()}>Gửi</button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div className="fb-post-2025-content">
          <p>{content}</p>
        </div>

        {imageSrc && (
          <img src={imageSrc} alt="Post" className="fb-post-2025-image" onClick={() => setModalOpen(true)} style={{ cursor: 'pointer' }} />
        )}

        <div className="fb-post-2025-stats">
          <span>{likeCount} lượt thích</span>
        </div>
        <span
          className="fb-post-2025-stat-item fb-post-2025-comment-count"
          onClick={() => setShowComments(true)}
          style={{ cursor: 'pointer', fontWeight: '600' }}
        >
          {commentsList.length} bình luận
        </span>
        <div className="fb-post-2025-actions">
          <button onClick={toggleLike} disabled={isLiking} className={`fb-post-2025-action-btn ${isLiked ? 'fb-post-2025-liked' : ''}`}>
            <LikeIcon filled={isLiked} />
            <span>{isLiked ? 'Đã thích' : 'Thích'}</span>
          </button>

          {/* BẤM VÀO CHỮ "BÌNH LUẬN" CŨNG MỞ */}
          <div onClick={() => setShowComments(true)} className="fb-post-2025-action-btn" style={{ cursor: 'pointer' }}>
            <CommentIcon />
            <span>Bình luận</span>
          </div>
        </div>

        {/* BÌNH LUẬN */}
        {showComments && (
          <div className="fb-post-2025-comments">
            <div className="fb-post-2025-comment-input">
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
              <div key={i} className="fb-post-2025-comment-item">
                <strong>{c.username || 'Bạn'}</strong>: {c.content}
              </div>
            ))}
          </div>
        )}
      </article>

      {/* MODAL ẢNH LỚN */}
      {modalOpen && imageSrc && (
        <div className="fb-post-2025-image-modal" onClick={() => setModalOpen(false)}>
          <button className="fb-post-2025-close-modal"><CloseIcon /></button>
          <img src={imageSrc} alt="Full size" />
        </div>
      )}
    </>
  );
}

export default Post;
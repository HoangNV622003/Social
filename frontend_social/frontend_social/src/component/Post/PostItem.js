// src/components/post/PostItem.js
import React, { useMemo, useState, useRef, useEffect } from 'react';
import './PostItem.css';
import UserAvatar from '../UserAvatar/UserAvatar';
import ReportPopup from '../Popup/ReportPopup';
import DeleteConfirmPopup from '../Popup/DeleteConfirmPopup';
import CommentSection from '../Comment/CommentSection';
import { formatMessageTime } from '../../utils/DateUtils';
import { SlLike, SlOptions } from 'react-icons/sl';
import { FaRegComment } from 'react-icons/fa';
import { toggleLike } from '../../apis/LikeService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IMAGE_SERVER_URL } from '../../constants/CommonConstants';
import PostImages from '../PostImage/PostImages';
const PostItem = ({ post: initialPost, onDelete }) => {
  const { token, user } = useAuth();
  const [post, setPost] = useState(initialPost);

  const [showMenu, setShowMenu] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const commentSectionRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const isOwner = user && post.author?.id === user.id;

  // Click outside để đóng menu & comment
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showComments && commentSectionRef.current && !commentSectionRef.current.contains(e.target)) {
        setShowComments(false);
      }
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showComments, showMenu]);

  // Xử lý ảnh
  const postImageUrl = useMemo(() => {
    return post.imageUrls;
  }, [post.imageUrls]);

  // Like handler
  const handleLike = async () => {
    if (!token) {
      toast.error('Vui lòng đăng nhập để thích bài viết');
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    const willBeLiked = !post.isLiked;

    setPost(prev => ({
      ...prev,
      isLiked: willBeLiked,
      totalLike: willBeLiked ? (prev.totalLike || 0) + 1 : (prev.totalLike || 0) - 1
    }));

    try {
      const res = await toggleLike(token, post.id);
      setPost(prev => ({
        ...prev,
        isLiked: res.data.isLiked ?? willBeLiked,
        totalLike: res.data.totalLike ?? prev.totalLike
      }));
    } catch (err) {
      setPost(prev => ({
        ...prev,
        isLiked: !willBeLiked,
        totalLike: willBeLiked ? prev.totalLike - 1 : prev.totalLike + 1
      }));
      toast.error(err.response?.data?.message || 'Thích bài viết thất bại');
    } finally {
      setIsLiking(false);
    }
  };
  const handleNavigateToProfile = () => {
    if (!isOwner) {
      navigate("/profile/" + post.author.id)
    }
  }
  const timeDisplay = formatMessageTime(post.dateCreated);

  return (
    <>
      <div className="post-item">
        {/* Header */}
        <div className="post-header">
          <div className="post-author"
            onClick={handleNavigateToProfile}
          >
            <UserAvatar
              username={post.author.username}
              image={post.author.image}
              size="medium"
              showOnline={false}
            />
            <div className="author-info">
              <h4 className="author-name">{post.author.username}</h4>
              <span className="post-time">{timeDisplay}</span>
            </div>
          </div>

          {/* Nút 3 chấm */}
          <div className="post-options-wrapper" ref={menuRef}>
            <button
              className="post-options-btn"
              onClick={() => setShowMenu(prev => !prev)}
              aria-label="Tùy chọn bài viết"
            >
              <SlOptions />
            </button>

            {showMenu && (
              <div className="options-menu">
                {isOwner ? (
                  <button
                    className="menu-item delete-item"
                    onClick={() => {
                      setShowDeletePopup(true);
                      setShowMenu(false);
                    }}
                  >
                    Xóa bài viết
                  </button>
                ) : (
                  <button
                    className="menu-item report-item"
                    onClick={() => {
                      setShowReportPopup(true);
                      setShowMenu(false);
                    }}
                  >
                    Báo cáo bài viết
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Nội dung */}
        <div className="post-content">
          {post.content && <p className="post-text">{post.content}</p>}
          {postImageUrl && (
            <div className="post-image-wrapper">

              <PostImages imageUrls={postImageUrl} postId={post.id} />
            </div>
          )}
        </div>

        {/* Thống kê */}
        <div className="post-stats">
          <span className="stat-item like-count">
            {post.totalLike > 0 ? `${post.totalLike} lượt thích` : 'Chưa có lượt thích'}
          </span>
          <span className="stat-item comment-count">
            {post.totalComment > 0 ? `${post.totalComment} bình luận` : 'Chưa có bình luận'}
          </span>
        </div>

        {/* Hành động */}
        <div className="post-actions">
          <button
            className={`action-btn like-btn ${post.isLiked ? 'liked' : ''} ${isLiking ? 'liking' : ''}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <SlLike />
            <span>Thích</span>
          </button>
          <button
            className="action-btn comment-btn"
            onClick={() => setShowComments(prev => !prev)}
          >
            <FaRegComment />
            <span>Bình luận</span>
          </button>
        </div>

        {/* Bình luận */}
        {showComments && (
          <div ref={commentSectionRef} className="post-comments-section">
            <CommentSection postId={post.id} />
          </div>
        )}
      </div>

      {/* Popup báo cáo */}
      {showReportPopup && (
        <ReportPopup
          postId={post.id}
          onClose={() => setShowReportPopup(false)}
        />
      )}

      {/* Popup xóa */}
      {showDeletePopup && (
        <DeleteConfirmPopup
          postId={post.id}
          onClose={() => setShowDeletePopup(false)}
          onSuccess={onDelete}
        />
      )}
    </>
  );
};

export default PostItem;
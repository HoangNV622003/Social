import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Post from './Post';
import { useAuth } from '../../context/AuthContext';
import {
  getMyProfile,
  getMyFriends,
  getMyPosts,
  uploadAvatar
} from '../../apis/ProfileService';
import { toast } from 'react-toastify';
import './Profile.css';

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  // === Tải toàn bộ dữ liệu khi vào trang ===
  useEffect(() => {
    if (!token) {
      toast.error('Bạn chưa đăng nhập!');
      navigate('/');
      return;
    }

    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        const [profileRes, friendsRes, postsRes] = await Promise.all([
          getMyProfile(token),
          getMyFriends(token),
          getMyPosts(token, 0, 50) // Lấy 50 bài đầu
        ]);

        setUserProfile(profileRes.data);
        setFriends(friendsRes.data || []);
        setPosts(postsRes.data.content || postsRes.data || []);
      } catch (err) {
        console.error('Lỗi tải trang cá nhân:', err);
        toast.error('Không thể tải thông tin cá nhân');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [token, navigate]);

  // === Upload avatar ===
  const handleAvatarUpload = async () => {
    if (!selectedFile) return toast.warn('Vui lòng chọn ảnh trước!');

    setUploading(true);
    try {
      await uploadAvatar(selectedFile, token);
      toast.success('Cập nhật avatar thành công!');

      // Cập nhật lại profile để lấy avatar mới
      const updatedProfile = await getMyProfile(token);
      setUserProfile(updatedProfile.data);
      setSelectedFile(null);
    } catch (err) {
      toast.error('Upload avatar thất bại');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // === Xử lý xóa/sửa bài viết ===
  const handleDelete = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    toast.info('Đã xóa bài viết');
  };

  const handleEdit = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    toast.success('Đã cập nhật bài viết');
  };

  // === Click vào bạn bè → chuyển trang ===
  const handleFriendClick = (username) => {
    navigate(`/profile_view/${username}`);
  };

  // === Loading state ===
  if (isLoading) {
    return (
      <div className="fb-profile-page">
        <Navbar />
        <div className="fb-loader text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3">Đang tải trang cá nhân...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="fb-profile-page">
        <Navbar />
        <div className="text-center py-5">
          <h3>Không tìm thấy thông tin</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="fb-profile-page">
      <Navbar />

      <div className="fb-profile-container">
        {/* Cover + Avatar */}
        <div className="fb-profile-cover">
          <div className="fb-avatar-wrapper">
            {userProfile.image ? (
              <img
                src={`data:image/jpeg;base64,${userProfile.image}`}
                alt="Avatar"
                className="fb-avatar-large"
              />
            ) : (
              <div className="fb-avatar-large default">
                {userProfile.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}

            <label className="fb-avatar-edit">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              Chỉnh sửa avatar
            </label>

            {selectedFile && (
              <div className="mt-2">
                <button
                  onClick={handleAvatarUpload}
                  disabled={uploading}
                  className="fb-upload-btn"
                >
                  {uploading ? 'Đang tải lên...' : 'Cập nhật avatar'}
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="fb-cancel-btn ms-2"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>

          <h1 className="fb-username">{userProfile.username}</h1>
          <p className="fb-email">{userProfile.email}</p>
          {userProfile.address && <p className="fb-address">{userProfile.address}</p>}
        </div>

        {/* Danh sách bạn bè */}
        <div className="fb-friends-section">
          <h3>Bạn bè ({friends.length})</h3>
          {friends.length === 0 ? (
            <p className="text-muted">Chưa có bạn bè nào</p>
          ) : (
            <div className="fb-friends-grid">
              {friends.slice(0, 9).map(friend => (
                <div
                  key={friend.id}
                  className="fb-friend-card"
                  onClick={() => handleFriendClick(friend.username)}
                  style={{ cursor: 'pointer' }}
                  title={`Xem trang cá nhân của ${friend.username}`}
                >
                  <div className="fb-friend-avatar">
                    {friend.username[0].toUpperCase()}
                  </div>
                  <p className="fb-friend-name">{friend.username}</p>
                </div>
              ))}
              {friends.length > 9 && (
                <div className="fb-friend-more">
                  <p>+ {friends.length - 9} người khác</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Danh sách bài viết */}
        <div className="fb-posts-section">
          <h3>Bài viết của bạn</h3>
          {posts.length === 0 ? (
            <p className="text-muted text-center py-5">Chưa có bài viết nào</p>
          ) : (
            posts.map(post => (
              <Post
                key={post.id}
                {...post}
                createdBy={userProfile.username}
                isOwner={true}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
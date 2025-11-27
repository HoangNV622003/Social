// src/components/profile/ProfileView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Post from './Post';
import { showAlert } from '../notice/notice';
import { useAuth } from '../../context/AuthContext';
import './ProfileView.css';

// === IMPORT ĐÚNG CÁC SERVICE CHÍNH CHỦ ===
import { getUserProfile, getPostsByUsername } from '../../apis/ProfileService';
import { addFriendRequest } from '../../apis/FriendService';
import { addToChat } from '../../apis/ChatService';

function ProfileView() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  // Làm sạch token (phòng trường hợp có "Bearer " ở đầu)
  const cleanToken = token?.startsWith('Bearer ') ? token.replace('Bearer ', '') : token;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friendStatus, setFriendStatus] = useState({
    friend: false,
    friendPending: false,
    friendRequestReceiver: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cleanToken) {
      showAlert("Vui lòng đăng nhập lại", "error");
      navigate('/login');
      return;
    }

    const fetchProfileAndPosts = async () => {
      setLoading(true);
      try {
        // Gọi 2 API song song bằng service chính chủ
        const [profileRes, postsRes] = await Promise.all([
          getUserProfile(username, cleanToken),
          getPostsByUsername(username, cleanToken, 0, 20)
        ]);

        const profileData = profileRes.data;
        const postsData = postsRes.data;

        setProfile(profileData);
        setPosts(Array.isArray(postsData) ? postsData : []);

        // Cập nhật trạng thái kết bạn từ backend trả về
        setFriendStatus({
          friend: profileData.friend || false,
          friendPending: profileData.friendPending || false,
          friendRequestReceiver: profileData.friendRequestReceiver || false,
        });

      } catch (err) {
        const msg = err.response?.data?.message || "Không thể tải trang cá nhân";
        showAlert(msg, "error");
        console.error("Lỗi tải profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [username, cleanToken, navigate]);

  // === THÊM BẠN BÈ ===
  const handleAddFriend = async () => {
    try {
      await addFriendRequest(username, cleanToken);
      showAlert("Đã gửi lời mời kết bạn!", "success");
      setFriendStatus(prev => ({ ...prev, friendRequestReceiver: true }));
    } catch (err) {
      const msg = err.response?.data?.message || "Gửi lời mời thất bại";
      showAlert(msg, "error");
    }
  };

  // === TẠO CHAT / NHẮN TIN ===
  const handleOpenChat = async () => {
    try {
      await addToChat(username, cleanToken);
      showAlert("Đã mở cuộc trò chuyện!", "success");
      navigate('/messages');
    } catch (err) {
      // Nếu chat đã tồn tại (409 Conflict) → vẫn chuyển sang messages
      if (err.response?.status === 409) {
        navigate('/messages');
      } else {
        showAlert("Không thể mở tin nhắn", "error");
      }
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="fb-profile-page">
        <Navbar />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="mt-3 fs-5">Đang tải trang cá nhân...</p>
        </div>
      </div>
    );
  }

  // Không tìm thấy profile
  if (!profile) {
    return (
      <div className="fb-profile-page">
        <Navbar />
        <div className="container py-5 text-center">
          <h3>Không tìm thấy người dùng</h3>
          <button onClick={() => navigate(-1)} className="btn btn-primary mt-3">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fb-profile-page">
      <Navbar />

      <div className="container my-5">
        {/* Header Profile */}
        <div className="card shadow-sm mb-4">
          <div className="card-body text-center py-5 position-relative">
            <img
              src={profile.image ? `data:image/jpeg;base64,${profile.image}` : '/default-avatar.png'}
              alt={profile.username}
              className="rounded-circle border border-5 border-white shadow"
              style={{ width: '160px', height: '160px', objectFit: 'cover' }}
            />
            <h1 className="mt-4 fw-bold">{profile.username}</h1>
            <p className="text-muted">{profile.email || 'Chưa có email công khai'}</p>

            {/* Nút hành động */}
            <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
              {friendStatus.friend ? (
                <button className="btn btn-success btn-lg px-5" disabled>
                  Đã là bạn bè
                </button>
              ) : friendStatus.friendPending && !friendStatus.friendRequestReceiver ? (
                <button className="btn btn-info btn-lg px-5" disabled>
                  Đang chờ chấp nhận
                </button>
              ) : friendStatus.friendRequestReceiver ? (
                <button className="btn btn-warning btn-lg px-5" disabled>
                  Đã gửi lời mời
                </button>
              ) : (
                <button onClick={handleAddFriend} className="btn btn-primary btn-lg px-5">
                  Thêm bạn bè
                </button>
              )}

              <button onClick={handleOpenChat} className="btn btn-outline-primary btn-lg px-5">
                Nhắn tin
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách bài viết */}
        <h3 className="mb-4">Bài viết của {profile.username}</h3>

        {posts.length === 0 ? (
          <div className="text-center py-5 bg-light rounded">
            <p className="fs-5 text-muted">Chưa có bài viết nào</p>
          </div>
        ) : (
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post.id} className="col-12">
                <Post {...post} createdBy={profile.username} isOwner={false} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileView;
// src/pages/EditProfile/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import './EditProfile.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../component/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';
import { getProfile } from '../../apis/AuthService';
import { updateUserProfile } from '../../apis/UserService';

import AvatarUploader from './AvatarUploader';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';

const EditProfile = () => {
  const { token, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [originalData, setOriginalData] = useState({});
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    address: '',
  });

  // Avatar state
  const [avatarFile, setAvatarFile] = useState(null);           // File gửi lên server
  const [avatarPreview, setAvatarPreview] = useState(null);     // URL hiện tại đang hiển thị
  const [originalAvatar, setOriginalAvatar] = useState(null);   // Path ảnh gốc từ server

  useEffect(() => {
    if (!token) {
      toast.error('Bạn chưa đăng nhập!');
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile(token);
        const data = response.data;

        setOriginalData(data);
        setUserData({
          username: data.username || '',
          email: data.email || '',
          address: data.address || '',
        });

        // Lưu đường dẫn ảnh gốc từ server (ví dụ: "/uploads/avatar.jpg")
        const serverImagePath = data.image || null;
        setOriginalAvatar(serverImagePath);
        setAvatarPreview(serverImagePath); // Ban đầu hiển thị ảnh từ server

      } catch (err) {
        toast.error('Không thể tải thông tin cá nhân');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  // Xử lý khi người dùng chọn/xóa ảnh
  const handleAvatarChange = (file, previewUrl) => {
    setAvatarFile(file);

    if (previewUrl === null) {
      // Người dùng bấm "Xóa tạm thời" → quay lại ảnh gốc
      setAvatarPreview(originalAvatar);
    } else {
      // Người dùng chọn ảnh mới → hiển thị preview
      setAvatarPreview(previewUrl);
    }
  };

  // Cập nhật hồ sơ + ảnh
  const handleUpdateProfile = async (updatedInfo) => {
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('username', updatedInfo.username);
    formData.append('email', updatedInfo.email);
    if (updatedInfo.address) formData.append('address', updatedInfo.address);
    if (avatarFile) formData.append('file', avatarFile);

    try {
      setLoading(true);
      const response = await updateUserProfile(formData, token);
      const newData = response.data;

      // -------------------------
      // 🔥 CẬP NHẬT VÀO UI
      // -------------------------
      setOriginalData(newData);
      setUserData({
        username: newData.username || '',
        email: newData.email || '',
        address: newData.address || '',
      });

      const newImagePath = newData.image || null;
      setOriginalAvatar(newImagePath);
      setAvatarPreview(newImagePath);
      setAvatarFile(null);

      setUser(newData);          // cập nhật context -> UI cập nhật ngay

      toast.success('Cập nhật hồ sơ thành công!');
      setSuccess('Thông tin đã được cập nhật!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Cập nhật thất bại';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData.username) {
    return (
      <div className="edit-profile-container text-center py-5">
        <Navbar />
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="edit-profile-container">
        <h2>Chỉnh sửa hồ sơ</h2>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Avatar Section */}
        <div className="profile-section avatar-section">
          <h3>Ảnh đại diện</h3>
          <AvatarUploader
            avatarUrl={avatarPreview}
            originalAvatar={originalAvatar}
            onAvatarChange={handleAvatarChange}
            disabled={loading}
          />
        </div>

        <ProfileForm
          userData={userData}
          setUserData={setUserData}
          onSubmit={handleUpdateProfile}
          loading={loading}
        />

        <PasswordForm loading={loading} token={token} logout={logout} navigate={navigate} />
      </div>
    </div>
  );
};

export default EditProfile;
import React, { useState, useEffect } from 'react';
import './Edit_profile.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile, changePassword } from '../../apis/UserService';
import { toast } from 'react-toastify';

const Edit_profile = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    address: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [passwordVisible, setPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  // === TẢI THÔNG TIN CÁ NHÂN ===
  useEffect(() => {
    if (!token) {
      toast.error('Bạn chưa đăng nhập!');
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile(token);
        const data = response.data;

        setUserData({
          username: data.username || '',
          email: data.email || '',
          address: data.address || ''
        });
      } catch (err) {
        console.error('Lỗi tải hồ sơ:', err);
        toast.error('Không thể tải thông tin cá nhân');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  // === XỬ LÝ INPUT PROFILE ===
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // === XỬ LÝ INPUT MẬT KHẨU ===
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // === CẬP NHẬT HỒ SƠ ===
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    try {
      setLoading(true);
      await updateUserProfile(userData, token);
      toast.success('Cập nhật hồ sơ thành công!');
      setSuccess('Thông tin đã được cập nhật!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Cập nhật hồ sơ thất bại';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // === ĐỔI MẬT KHẨU + TỰ ĐỘNG LOGOUT ===
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      toast.warn('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      toast.warn('Mật khẩu quá ngắn');
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword: confirmPassword
      }, token);

      toast.success('Đổi mật khẩu thành công! Đang đăng xuất...');

      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Tự động logout sau 3 giây
      setTimeout(() => {
        if (logout) logout();
        localStorage.clear();
        navigate('/');
        toast.info('Bạn đã được đăng xuất an toàn');
      }, 3000);

    } catch (err) {
      const msg = err.response?.data?.message || 'Đổi mật khẩu thất bại';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // === LOADING TRẠNG THÁI ===
  if (loading && !userData.username) {
    return (
      <div className="edit-profile-container text-center py-5">
        <Navbar />
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Đang tải thông tin cá nhân...</p>
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

        {/* === THÔNG TIN CÁ NHÂN === */}
        <div className="profile-section">
          <h3>Thông tin cá nhân</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleProfileChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleProfileChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={userData.address || ''}
                onChange={handleProfileChange}
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
            </button>
          </form>
        </div>

        {/* === ĐỔI MẬT KHẨU === */}
        <div className="password-section">
          <h3>Đổi mật khẩu</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Mật khẩu hiện tại</label>
              <div className="password-input-container">
                <input
                  type={passwordVisible.currentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={loading}
                />
                <span className="password-toggle" onClick={() => togglePasswordVisibility('currentPassword')}>
                  {passwordVisible.currentPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Mật khẩu mới</label>
              <div className="password-input-container">
                <input
                  type={passwordVisible.newPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={loading}
                />
                <span className="password-toggle" onClick={() => togglePasswordVisibility('newPassword')}>
                  {passwordVisible.newPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Xác nhận mật khẩu mới</label>
              <div className="password-input-container">
                <input
                  type={passwordVisible.confirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={loading}
                />
                <span className="password-toggle" onClick={() => togglePasswordVisibility('confirmPassword')}>
                  {passwordVisible.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit_profile;
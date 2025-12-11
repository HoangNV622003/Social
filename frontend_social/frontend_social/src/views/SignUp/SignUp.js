// src/pages/SignUp/SignUp.jsx
import React, { useState } from 'react';
import './SignUp.css';
import { toast } from 'react-toastify';
import { createUser } from '../../apis/UserService';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu khớp
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (formData.password.length < 6) {
      toast.warn('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      await createUser({
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
      });

      toast.success('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');

      // Reset form
      setFormData({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      });

      // Chuyển về trang login sau 1.5s
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.errorDescription ||
        err.response?.data?.message ||
        'Đăng ký thất bại, vui lòng thử lại!';

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Đăng ký tài khoản</h1>
          <p>Tham gia Block Chat ngay hôm nay</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên bạn muốn dùng"
              required
              minLength="3"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ít nhất 6 ký tự"
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`signup-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>

          <p className="login-link">
            Đã có tài khoản?{' '}
            <a href="/">Đăng nhập ngay</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
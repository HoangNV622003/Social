// src/pages/EditProfile/components/PasswordForm.jsx
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { changePassword } from '../../apis/UserService';
import { toast } from 'react-toastify';
import './PasswordForm.css';

const PasswordForm = ({ loading: parentLoading, token, logout, navigate }) => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [visible, setVisible] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const toggle = (field) => {
        setVisible(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setError('Mật khẩu xác nhận không khớp!');
        }

        if (passwordData.newPassword.length < 6) {
            return setError('Mật khẩu mới phải có ít nhất 6 ký tự!');
        }

        setLoading(true);
        try {
            await changePassword(passwordData, token);
            toast.success('Đổi mật khẩu thành công! Đang đăng xuất...');
            setTimeout(() => {
                logout();
                localStorage.clear();
                navigate('/');
            }, 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Đổi mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="password-section">
            <h3>Đổi mật khẩu</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>

                {/* Mật khẩu hiện tại */}
                <div className="password-group">
                    <label>Mật khẩu hiện tại</label>
                    <div className="password-input-wrapper">
                        <input
                            type={visible.currentPassword ? 'text' : 'password'}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handleChange}
                            required
                            disabled={loading || parentLoading}
                        />
                        <span onClick={() => toggle('currentPassword')} className="eye-icon">
                            {visible.currentPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                {/* Mật khẩu mới */}
                <div className="password-group">
                    <label>Mật khẩu mới</label>
                    <div className="password-input-wrapper">
                        <input
                            type={visible.newPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handleChange}
                            required
                            disabled={loading || parentLoading}
                        />
                        <span onClick={() => toggle('newPassword')} className="eye-icon">
                            {visible.newPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                {/* Xác nhận mật khẩu */}
                <div className="password-group">
                    <label>Xác nhận mật khẩu</label>
                    <div className="password-input-wrapper">
                        <input
                            type={visible.confirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading || parentLoading}
                        />
                        <span onClick={() => toggle('confirmPassword')} className="eye-icon">
                            {visible.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading || parentLoading}
                >
                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
            </form>
        </div>
    );
};

export default PasswordForm;

// src/pages/EditProfile/components/ProfileForm.jsx
import React from 'react';
import './ProfileForm.css'
const ProfileForm = ({ userData, setUserData, onSubmit, loading }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(userData);
    };

    return (
        <div className="profile-section">
            <h3>Thông tin cá nhân</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input type="text" name="username" value={userData.username} onChange={handleChange} required disabled={loading} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={userData.email} onChange={handleChange} required disabled={loading} />
                </div>
                <div className="form-group">
                    <label>Địa chỉ</label>
                    <input type="text" name="address" value={userData.address || ''} onChange={handleChange} disabled={loading} />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
                </button>
            </form>
        </div>
    );
};

export default ProfileForm;
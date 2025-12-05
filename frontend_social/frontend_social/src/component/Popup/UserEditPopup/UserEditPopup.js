// src/pages/admin/components/UserEditPopup/UserEditPopup.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getUserByAdmin, updateUserByAdmin } from "../../../apis/UserService";
import UserEditForm from './UserEditForm';
import './UserEditPopup.css';
import { toast } from 'react-toastify';
const UserEditPopup = ({ userId, onClose, onUpdateSuccess }) => {
    const { token } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await getUserByAdmin(userId, token);
                setUser(res.data); // UserResponseDTO
            } catch (err) {
                toast.error('Không thể tải thông tin người dùng');
                onClose();
            } finally {
                setLoading(false);
            }
        };

        if (userId && token) fetchUser();
    }, [userId, token, onClose]);

    const handleUpdate = async (formDataToSend) => {
        setSaving(true);
        try {
            await updateUserByAdmin(userId, formDataToSend, token);
            toast.success('Cập nhật người dùng thành công!');
            onUpdateSuccess?.();
        } catch (err) {
            const msg = err.response?.data?.message || 'Cập nhật thất bại';
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="ue-overlay" onClick={onClose}>
            <div className="ue-popup" onClick={e => e.stopPropagation()}>
                <div className="ue-header">
                    <h2>Chỉnh sửa người dùng</h2>
                    <button className="ue-close" onClick={onClose} disabled={saving}>
                        X
                    </button>
                </div>

                <div className="ue-body">
                    {loading ? (
                        <div className="ue-loading">Đang tải thông tin...</div>
                    ) : (
                        <UserEditForm
                            user={user}
                            onSubmit={handleUpdate}
                            onCancel={onClose}
                            isSaving={saving}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserEditPopup;
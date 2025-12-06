// src/components/group/CreateGroupPopup.jsx
import React, { useState, useRef } from 'react';
import { FiX, FiCamera } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { createGroupChat } from '../../../apis/ChatService';
import FriendSearchList from './FriendSearchList';
import SelectedMembers from './SelectedMembers';
import './CreateGroupPopup.css';
import { toast } from 'react-toastify';

const CreateGroupPopup = ({ currentUserId, onClose, onCreateSuccess }) => {
    const { token } = useAuth();
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [groupImage, setGroupImage] = useState(null);        // File ảnh
    const [imagePreview, setImagePreview] = useState(null);   // Preview ảnh
    const fileInputRef = useRef(null);

    // Xử lý chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Kiểm tra loại file
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh');
            return;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB
            toast.error('Ảnh không được quá 10MB');
            return;
        }

        setGroupImage(file);

        // Tạo preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Xóa ảnh
    const removeImage = () => {
        setGroupImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCreate = async () => {
        if (!groupName.trim()) {
            toast.error('Vui lòng nhập tên nhóm');
            return;
        }
        if (selectedMembers.length === 0) {
            toast.error('Vui lòng chọn ít nhất 1 thành viên');
            return;
        }

        setIsCreating(true);

        try {
            // Tạo FormData thay vì JSON
            const formData = new FormData();
            formData.append('groupName', groupName.trim());

            // Thêm file ảnh (nếu có)
            if (groupImage) {
                formData.append('file', groupImage);
            }

            // Thêm danh sách userIds
            selectedMembers.forEach(member => {
                formData.append('userIds', member.id);
            });

            const response = await createGroupChat(formData, token);

            toast.success(`Tạo nhóm "${groupName}" thành công!`, {
                icon: 'Success',
            });

            onCreateSuccess?.({
                message: `Tạo nhóm "${groupName}" thành công!`,
                newGroup: response.data
            });

            onClose();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Tạo nhóm thất bại';
            toast.error(errorMsg);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="cg-overlay" onClick={onClose}>
            <div className="cg-popup" onClick={e => e.stopPropagation()}>
                <div className="cg-header">
                    <h2>Tạo nhóm chat mới</h2>
                    <button className="cg-close" onClick={onClose} disabled={isCreating}>
                        <FiX size={24} />
                    </button>
                </div>

                <div className="cg-body">
                    {/* Ảnh nhóm + tên nhóm */}
                    <div className="cg-group-info">
                        <div className="cg-avatar-wrapper">
                            <div
                                className="cg-avatar-preview"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Group" />
                                ) : (
                                    <div className="cg-avatar-placeholder">
                                        <FiCamera size={32} />
                                        <span>Thêm ảnh nhóm</span>
                                    </div>
                                )}
                            </div>
                            {imagePreview && (
                                <button className="cg-remove-image" onClick={removeImage}>
                                    <FiX size={16} />
                                </button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Nhập tên nhóm..."
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            disabled={isCreating}
                            className="cg-group-name-input"
                            maxLength={100}
                            autoFocus
                        />
                    </div>

                    {/* Tìm kiếm thành viên */}
                    <div className="cg-input-group">
                        <label>Thêm thành viên</label>
                        <div className="cg-search-input-wrapper">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bạn bè..."
                                value={searchKeyword}
                                onChange={e => setSearchKeyword(e.target.value)}
                                disabled={isCreating}
                            />
                        </div>
                    </div>

                    {selectedMembers.length > 0 && (
                        <SelectedMembers
                            members={selectedMembers}
                            onRemove={id => setSelectedMembers(prev => prev.filter(m => m.id !== id))}
                        />
                    )}

                    <FriendSearchList
                        keyword={searchKeyword}
                        currentUserId={currentUserId}
                        selectedIds={selectedMembers.map(m => m.id)}
                        onSelect={friend => {
                            if (!selectedMembers.find(m => m.id === friend.id)) {
                                setSelectedMembers(prev => [...prev, friend]);
                            }
                            setSearchKeyword('');
                        }}
                    />
                </div>

                <div className="cg-footer">
                    <button
                        className="cg-btn-cancel"
                        onClick={onClose}
                        disabled={isCreating}
                    >
                        Hủy
                    </button>
                    <button
                        className="cg-btn-create"
                        onClick={handleCreate}
                        disabled={!groupName.trim() || selectedMembers.length === 0 || isCreating}
                    >
                        {isCreating ? 'Đang tạo...' : 'Tạo nhóm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupPopup;
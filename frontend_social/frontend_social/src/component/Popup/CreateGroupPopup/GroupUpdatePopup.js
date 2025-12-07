// src/components/chat/GroupUpdatePopup.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiSearch, FiCamera } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { updateGroupChat } from '../../../apis/ChatService';
import { searchFriend } from '../../../apis/FriendService';
import UserAvatar from '../../UserAvatar/UserAvatar';
import { toast } from 'react-toastify';
import './GroupUpdatePopup.css';
import { IMAGE_SERVER_URL } from '../../../constants/CommonConstants';

const GroupUpdatePopup = ({ chat, onClose, onUpdateSuccess }) => {
    const { token, user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [groupName, setGroupName] = useState(chat.name || '');
    const [members, setMembers] = useState(chat.members || []);

    // QUAN TRỌNG: Luôn giữ ảnh gốc từ backend
    const originalImage = chat.image || null;
    const [newImageFile, setNewImageFile] = useState(null);     // File ảnh mới (nếu có)
    const [imagePreview, setImagePreview] = useState(originalImage); // Hiển thị: ảnh mới hoặc ảnh cũ
    const fileInputRef = useRef(null);

    // Tìm kiếm bạn bè
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await searchFriend(searchQuery.trim(), user.id, token);
                const friends = res.data.content || [];
                const filtered = friends.filter(friend =>
                    !members.some(m => m.id === friend.id)
                );
                setSearchResults(filtered);
            } catch (err) {
                toast.error('Không thể tìm kiếm bạn bè');
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, token, user.id, members]);

    // Xử lý chọn ảnh mới
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Ảnh không được quá 10MB');
            return;
        }

        setNewImageFile(file); // Lưu file để gửi lên

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result); // Hiển thị preview ảnh mới
        };
        reader.readAsDataURL(file);
    };

    // XÓA ẢNH MỚI – TRỞ VỀ ẢNH CŨ
    const removeNewImage = () => {
        setNewImageFile(null);
        setImagePreview(originalImage); // ← TRỞ VỀ ẢNH CŨ
        if (fileInputRef.current) fileInputRef.current.value = '';
        toast.info('Đã hủy ảnh mới – giữ nguyên ảnh cũ');
    };

    // Lưu thay đổi
    const handleSave = async () => {
        if (!groupName.trim()) {
            toast.error('Vui lòng nhập tên nhóm');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('groupName', groupName.trim());

            // Chỉ gửi ảnh nếu có ảnh mới
            if (newImageFile) {
                formData.append('file', newImageFile);
            }
            // Nếu không có ảnh mới → backend giữ nguyên ảnh cũ

            members.forEach(m => formData.append('userIds', m.id));
            await updateGroupChat(chat.id, formData, token);
            onUpdateSuccess?.();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cập nhật thất bại');
        }
    };

    const addMember = (friend) => {
        setMembers(prev => [...prev, friend]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const removeMember = (userId) => {
        setMembers(prev => prev.filter(m => m.id !== userId));
    };

    return (
        <div className="group-update-overlay" onClick={onClose}>
            <div className="group-update-popup" onClick={e => e.stopPropagation()}>
                <div className="popup-header">
                    <h3>Cập nhật phòng chat</h3>
                    <button onClick={onClose} className="close-btn">
                        <FiX size={24} />
                    </button>
                </div>

                <div className="popup-body">
                    {/* Ảnh nhóm + tên */}
                    <div className="group-info-section">
                        <div className="group-avatar-wrapper">
                            <div
                                className="group-avatar-preview"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <img
                                        src={newImageFile ? imagePreview : IMAGE_SERVER_URL + originalImage}
                                        alt="Group"
                                    />
                                ) : (
                                    <div className="avatar-placeholder">
                                        <FiCamera size={36} />
                                        <span>Chọn ảnh</span>
                                    </div>
                                )}
                            </div>

                            {/* Nút xóa ảnh mới */}
                            {newImageFile && (
                                <button onClick={removeNewImage} className="remove-image-btn">
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
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            placeholder="Tên nhóm"
                            className="group-name-input"
                            maxLength={100}
                        />
                    </div>

                    {/* Tìm kiếm + thành viên */}
                    <div className="search-section">
                        <div className="search-input-wrapper">
                            <FiSearch size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm để thêm thành viên..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {isSearching && <div className="search-loading">Đang tìm...</div>}

                        {searchResults.length > 0 && (
                            <div className="search-results">
                                {searchResults.map(friend => (
                                    <div key={friend.id} className="search-result-item" onClick={() => addMember(friend)}>
                                        <UserAvatar username={friend.username} image={friend.image} size="small" />
                                        <span>{friend.username}</span>
                                        <span className="add-text">Thêm</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="members-section">
                        <h4>Thành viên ({members.length})</h4>
                        <div className="members-list">
                            {members.map(member => (
                                <div key={member.id} className="member-item">
                                    <UserAvatar username={member.username} image={member.image} size="small" />
                                    <div className="member-info">
                                        <span className="member-name">{member.username}</span>
                                        {member.id === chat.ownerId && <span className="owner-badge">Quản trị viên</span>}
                                    </div>
                                    {member.id !== user.id && member.id !== chat.ownerId && (
                                        <button onClick={() => removeMember(member.id)} className="remove-member-btn">
                                            <FiX size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="popup-footer">
                    <button onClick={onClose} className="btn-cancel">Hủy</button>
                    <button onClick={handleSave} className="btn-save">
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupUpdatePopup;
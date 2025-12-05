// src/components/group/CreateGroupPopup.jsx
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
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

        const payload = {
            groupName: groupName.trim(),
            userIds: selectedMembers.map(m => m.id),
        };

        try {
            const response = await createGroupChat(payload, token);

            // Thành công → thông báo + callback + đóng popup
            toast.success(`Tạo nhóm "${groupName}" thành công!`, {
                icon: 'Success',
                duration: 4000,
            });

            onCreateSuccess?.({
                message: `Tạo nhóm "${groupName}" thành công!`,
                newGroup: response.data
            });

            onClose(); // Đóng popup
        } catch (err) {
            const errorMsg = err.response?.data?.message
                || err.message
                || 'Tạo nhóm thất bại, vui lòng thử lại';

            toast.error(errorMsg, {
                duration: 5000,
            });
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
                    <div className="cg-input-group">
                        <label>Tên nhóm</label>
                        <input
                            type="text"
                            placeholder="Nhập tên nhóm..."
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            disabled={isCreating}
                            autoFocus
                        />
                    </div>

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
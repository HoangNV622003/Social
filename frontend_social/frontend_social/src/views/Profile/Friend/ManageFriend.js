// src/components/Friend/ManageFriend.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getFriend } from '../../../apis/FriendService';
import FriendList from './FriendList';
import './ManageFriend.css';

const ManageFriend = ({ profileId }) => {
    const { token, user: currentUser } = useAuth();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFriends = async () => {
            if (!token || !profileId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await getFriend(profileId, token);
                setFriends(response.data.content || []);
            } catch (err) {
                console.error('Lỗi tải danh sách bạn bè:', err);
                setError('Không thể tải danh sách bạn bè');
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [profileId, token]);

    if (loading) {
        return <div className="manage-friend-loading">Đang tải bạn bè...</div>;
    }

    if (error) {
        return <div className="manage-friend-error">{error}</div>;
    }

    return (
        <div className="manage-friend">
            <h3>Danh sách bạn bè ({friends.length})</h3>
            <FriendList friends={friends} currentUserId={currentUser?.id} />
        </div>
    );
};

export default ManageFriend;
// src/components/group/FriendSearchList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext'; // Lấy token
import FriendSearchItem from './FriendSearchItem';
import './FriendSearchList.css';
import { searchFriend } from '../../../apis/FriendService';
const FriendSearchList = ({ keyword, currentUserId, selectedIds, onSelect }) => {
    const { token } = useAuth(); // Lấy token từ AuthContext
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);

    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    const fetchFriends = useCallback(
        debounce(async (searchTerm) => {
            if (!searchTerm.trim() || !token) {
                setFriends([]);
                return;
            }

            setLoading(true);
            try {
                const res = await searchFriend(searchTerm, currentUserId, token);
                const list = (res.data?.content || [])
                    .filter(user => user.id !== currentUserId); // Loại chính mình ra
                setFriends(list);
            } catch (err) {
                console.error('Lỗi tìm kiếm bạn bè:', err);
                setFriends([]);
            } finally {
                setLoading(false);
            }
        }, 400),
        [currentUserId, token]
    );

    useEffect(() => {
        fetchFriends(keyword);
    }, [keyword, fetchFriends]);

    if (!keyword) return null;
    if (loading) return <div className="fs-loading">Đang tìm kiếm...</div>;
    if (friends.length === 0) return <div className="fs-empty">Không tìm thấy bạn bè</div>;

    return (
        <div className="fs-list">
            {friends.map(friend => (
                <FriendSearchItem
                    key={friend.id}
                    friend={friend}
                    isSelected={selectedIds.includes(friend.id)}
                    onSelect={() => onSelect(friend)}
                />
            ))}
        </div>
    );
};

export default FriendSearchList;
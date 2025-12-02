// src/components/FriendSearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { searchFriend } from '../../apis/FriendService';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../UserAvatar/UserAvatar';
import './FriendSearchBar.css';

const FriendSearchBar = ({ onSelectFriend }) => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { token } = useAuth();
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    // Tìm kiếm (debounce 300ms)
    useEffect(() => {
        if (!keyword.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setLoading(true);
        setIsOpen(true);

        const timer = setTimeout(async () => {
            try {
                const res = await searchFriend(keyword.trim(), token);
                setResults(res.data || []);
            } catch (err) {
                console.error('Lỗi tìm kiếm bạn bè:', err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [keyword, token]);

    // Click ngoài → đóng dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (friend) => {
        onSelectFriend(friend);
        setKeyword('');
        setIsOpen(false);
        inputRef.current?.blur();
    };

    return (
        <div className="friend-search-wrapper" ref={dropdownRef}>
            <div className="friend-search-input-container">
                <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Tìm kiếm bạn bè..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onFocus={() => keyword.trim() && setIsOpen(true)}
                    className="friend-search-input"
                />
                {keyword && (
                    <button
                        onClick={() => {
                            setKeyword('');
                            setIsOpen(false);
                        }}
                        className="clear-search-btn"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Dropdown kết quả */}
            {isOpen && (
                <div className="friend-search-dropdown">
                    {loading ? (
                        <div className="search-item loading">
                            <div className="skeleton-avatar"></div>
                            <div className="skeleton-text"></div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="search-empty">
                            <svg viewBox="0 0 24 24" width="48" height="48" fill="#9ca3af">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            <p>Không tìm thấy "{keyword}"</p>
                        </div>
                    ) : (
                        results.map((friend) => (
                            <div
                                key={friend.id}
                                className="search-item"
                                onClick={() => handleSelect(friend)}
                            >
                                <UserAvatar username={friend.username} image={friend.image} size="small" />
                                <div className="friend-info">
                                    <span className="friend-username">{friend.username}</span>
                                    {/* Nếu backend có tên đầy đủ thì thêm */}
                                    {/* <span className="friend-fullname">Nguyễn Văn A</span> */}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default FriendSearchBar;
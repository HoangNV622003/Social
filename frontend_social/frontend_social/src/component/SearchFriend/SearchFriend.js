// src/components/friend/SearchFriend.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchFriend } from '../../apis/FriendService';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../UserAvatar/UserAvatar';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import './SearchFriend.css';

const SearchFriend = ({ onSelect, placeholder = "Tìm kiếm bạn bè..." }) => {
    const { token, user } = useAuth();
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    // Debounce search
    const performSearch = useCallback(async (searchTerm) => {
        if (!searchTerm.trim()) {
            setResults([]);
            setShowResults(false);
            return;
        }

        setLoading(true);
        try {
            const res = await searchFriend(searchTerm.trim(), user.id, token);
            const friends = res.data.content || [];
            setResults(friends);
            setShowResults(true);
        } catch (err) {
            console.error('Lỗi tìm kiếm bạn bè:', err);
            setResults([]);
            setShowResults(true); // vẫn hiện dropdown để hiện "Không tìm thấy"
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Gọi API khi keyword thay đổi (có debounce 300ms)
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            performSearch(keyword);
        }, 300);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [keyword, performSearch]);

    // Click ngoài để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (friend) => {
        onSelect?.(friend);
        setKeyword('');
        setResults([]);
        setShowResults(false);
    };

    const clearSearch = () => {
        setKeyword('');
        setResults([]);
        setShowResults(false);
    };

    return (
        <div className="search-friend-container" ref={searchRef}>
            <div className="search-friend-input-wrapper">
                <AiOutlineSearch className="search-icon" />
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onFocus={() => results.length > 0 && setShowResults(true)}
                    placeholder={placeholder}
                    className="search-friend-input"
                />
                {keyword && (
                    <button onClick={clearSearch} className="clear-btn">
                        <AiOutlineClose />
                    </button>
                )}
            </div>

            {/* Dropdown kết quả */}
            {showResults && (
                <div className="search-results-dropdown">
                    {loading ? (
                        <div className="search-loading">Đang tìm kiếm...</div>
                    ) : results.length === 0 ? (
                        <div className="search-empty">
                            {keyword ? 'Không tìm thấy bạn bè' : 'Nhập tên để tìm kiếm'}
                        </div>
                    ) : (
                        <ul className="search-results-list">
                            {results.map((friend) => (
                                <li
                                    key={friend.id}
                                    className="search-result-item"
                                    onClick={() => handleSelect(friend)}
                                >
                                    <UserAvatar
                                        username={friend.username}
                                        image={friend.image}
                                        size="small"
                                    />
                                    <span className="friend-username">{friend.username}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchFriend;
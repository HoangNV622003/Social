// src/pages/admin/components/UserSearch/UserSearch.jsx
import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { debounce } from 'lodash';
import './UserSearch.css';

const UserSearch = ({ value, onSearch, placeholder }) => {
    const [inputValue, setInputValue] = useState(value);

    const debouncedSearch = debounce((val) => {
        onSearch(val);
    }, 500);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        debouncedSearch(val);
    };

    return (
        <div className="user-search">
            <FiSearch className="search-icon" />
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder={placeholder}
                className="search-input"
            />
        </div>
    );
};

export default UserSearch;
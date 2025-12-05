// src/components/post/PostList.js (hoặc src/components/post/PostList.js)
import React, { useState, useEffect } from 'react';
import PostItem from './PostItem';
import './PostList.css';

const PostList = ({ posts = [], isLoading = false, error = null }) => {
    const [currentPosts, setCurrentPosts] = useState(posts);

    // Cập nhật khi props posts thay đổi (load more, refresh, v.v.)
    useEffect(() => {
        setCurrentPosts(posts);
    }, [posts]);

    // Hàm xóa bài viết khỏi danh sách (gọi từ DeleteConfirmPopup gọi sau khi xóa thành công)
    const handleDeletePost = (deletedPostId) => {
        setCurrentPosts(prev => prev.filter(post => post.id !== deletedPostId));
    };

    // Loading
    if (isLoading) {
        return (
            <div className="listpost-loading">
                <div className="spinner"></div>
                <p>Đang tải bài viết...</p>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="listpost-error">
                <p>{error}</p>
            </div>
        );
    }

    // Empty
    if (!currentPosts || currentPosts.length === 0) {
        return (
            <div className="listpost-empty">
                <h3>Chưa có bài viết nào</h3>
                <p>Hãy là người đầu tiên chia sẻ khoảnh khắc của bạn!</p>
            </div>
        );
    }

    // Danh sách bài viết
    return (
        <div className="listpost">
            {currentPosts.map((post) => (
                <PostItem
                    key={post.id}
                    post={post}
                    onDelete={handleDeletePost} // BẮT BUỘC TRUYỀN VÀO ĐÂY
                />
            ))}
        </div>
    );
};

export default PostList;
import React, { useState } from "react";
import UserPost from "./User_post"; // Import component Post

function PostList({ initialPosts }) {
    const [postList, setPostList] = useState(initialPosts); // State lưu danh sách bài viết

    // Hàm xử lý xóa bài viết
    const handleDelete = (postId) => {
        // Loại bỏ bài viết khỏi danh sách
        setPostList((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    };
    const handlePostUpdate = (postId, updatedPost) => {
        setPostList((prevPosts) =>
            prevPosts.map((post) => (post.id === postId ? updatedPost : post))
        );
    };
    
    return (
        <div>
            {postList.map((post) => (
                <UserPost
                    key={post.id} // Khóa duy nhất
                    {...post}    // Truyền toàn bộ dữ liệu bài viết
                    onDelete={handleDelete} // Truyền callback để xóa bài viết
                    onEdit={handlePostUpdate}
                />
            ))}
        </div>
    );
}

export default PostList;

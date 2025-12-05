// src/components/comment/CommentList.js
import React from 'react';
import CommentItem from './CommentItem';
import './CommentList.css';

const CommentList = ({ comments = [] }) => {
    if (!comments || comments.length === 0) {
        return (
            <div className="no-comments">
                <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            </div>
        );
    }

    return (
        <div className="comment-list">
            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
    );
};

export default CommentList;
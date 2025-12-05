// src/components/comment/CommentItem.js
import React from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import { formatMessageTime } from '../../utils/DateUtils';
import "./CommentItem.css"
const CommentItem = ({ comment }) => {
    const timeDisplay = formatMessageTime(comment.dateCreated || new Date());

    const commentImageUrl = comment.image

    return (
        <div className="comment-item">
            <UserAvatar
                username={comment.author.username}
                image={comment.author.image}
                size="small"
            />

            <div className="comment-content">
                <div className="comment-bubble">
                    <span className="comment-author">{comment.author.username}</span>
                    <p className="comment-text">{comment.content}</p>
                </div>

                {commentImageUrl && (
                    <img src={commentImageUrl} alt="Bình luận" className="comment-image" />
                )}

                <div className="comment-actions">
                    <span className="comment-time">{timeDisplay}</span>
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
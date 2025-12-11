// src/components/comment/CommentSection.js
import React, { useState, useEffect } from 'react';
import CommentList from '../../component/Comment/CommentList';
import { getCommentsByPostId } from '../../apis/CommentService';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const CommentSection = ({ postId, onNewComment }) => {
    const { token } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadComments = async () => {
        setLoading(true);
        try {
            const res = await getCommentsByPostId(postId, token);
            setComments(res.data.content || []);
        } catch (err) {
            toast.error('Không tải được bình luận');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postId) loadComments();
    }, [postId]);

    // Khi có bình luận mới từ cha (PostDetail), reload lại
    useEffect(() => {
        if (onNewComment) loadComments();
    }, [onNewComment]);

    return (
        <div className="comment-section">
            <CommentList comments={comments} loading={loading} />
        </div>
    );
};

export default CommentSection;
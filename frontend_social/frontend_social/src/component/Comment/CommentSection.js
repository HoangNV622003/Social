// src/components/comment/CommentSection.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CommentList from './CommentList';
import { createComment, getCommentsByPostId } from '../../apis/CommentService';
import { toast } from 'react-toastify';
import './CommentSection.css';
import { VscSend } from "react-icons/vsc";

const CommentSection = ({ postId }) => {
    const { token, user } = useAuth();
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (postId) {
            loadComments();
        }
    }, [postId]);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !image) return;

        setSending(true);
        try {
            const formData = new FormData();
            formData.append('content', content.trim());
            if (image) formData.append('file', image);

            await createComment(token, postId, formData);
            toast.success('Đã đăng bình luận!');
            setContent('');
            setImage(null);
            setImagePreview(null);
            loadComments(); // Reload comments
        } catch (err) {
            toast.error('Gửi bình luận thất bại');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="comment-section">
            <CommentList comments={comments} />

            <form className="comment-form" onSubmit={handleSubmit}>

                <div className="comment-input-wrapper">
                    <input
                        type="text"
                        placeholder="Viết bình luận..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={sending}
                    />

                    <div className="comment-tools">
                        <label className="tool-btn">
                            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                        </label>

                        <button
                            type="submit"
                            className="send-btn"
                            disabled={sending || (!content.trim() && !image)}
                        >
                            <VscSend />
                        </button>
                    </div>
                </div>
            </form>

            {imagePreview && (
                <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button onClick={() => { setImage(null); setImagePreview(null); }}>×</button>
                </div>
            )}
            {loading && (
                <div className="comment-skeleton">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton-line" />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentSection;
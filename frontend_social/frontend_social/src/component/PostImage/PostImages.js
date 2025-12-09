// PostImages.jsx - ĐÃ SỬA ĐÚNG 100%
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PostImages.css';
import { IMAGE_SERVER_URL } from '../../constants/CommonConstants';

const PostImages = ({ imageUrls = [], postId }) => {
    const navigate = useNavigate();
    const total = imageUrls.length;
    if (total === 0) return null;

    // QUAN TRỌNG: Chỉ hiển thị tối đa 4 ảnh thật + 1 ô overlay nếu có nhiều hơn
    const visibleImages = total > 4 ? imageUrls.slice(0, 4) : imageUrls.slice(0, 5);
    const remaining = total > 4 ? total - 4 : 0;  // Nếu có hơn 4 ảnh → còn lại = total - 4

    const handleClick = () => {
        navigate(`/post/${postId}`);
    };

    return (
        <div
            className={`post-images-grid count-${Math.min(total, 5)}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
            {visibleImages.map((url, index) => {
                const isOverlayItem = total > 4 && index === 3; // index bắt đầu từ 0 → ảnh thứ 4 là overlay
                const overlayCount = total - 4;

                return (
                    <div
                        key={index}
                        className={`img-item item-${index + 1} ${isOverlayItem ? 'has-overlay' : ''}`}
                    >
                        <img src={`${IMAGE_SERVER_URL}${url}`} alt={`Ảnh ${index + 1}`} />
                        {isOverlayItem && (
                            <div className="overlay">
                                <span>+{overlayCount}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default PostImages;
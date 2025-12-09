// src/components/ImageViewer/ImageViewer.jsx
import React, { useState } from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';
import './ImageViewer.css';
import { IMAGE_SERVER_URL } from '../../constants/CommonConstants';

const ImageViewer = ({ images = [], initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    if (!images || images.length === 0) {
        return <div className="image-viewer-empty">Không có hình ảnh</div>;
    }

    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleThumbnailClick = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="image-viewer">
            {/* Ảnh lớn */}
            <div className="main-image-container">
                <img
                    src={IMAGE_SERVER_URL + images[currentIndex]}
                    alt={`Ảnh ${currentIndex + 1}`}
                    className="main-image"
                />

                {/* Nút Previous */}
                {images.length > 1 && (
                    <button className="nav-btn prev-btn" onClick={goPrev}>
                        <GrPrevious size={28} />
                    </button>
                )}

                {/* Nút Next */}
                {images.length > 1 && (
                    <button className="nav-btn next-btn" onClick={goNext}>
                        <GrNext size={28} />
                    </button>
                )}

                {/* Chỉ số ảnh */}
                {images.length > 1 && (
                    <div className="image-counter">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Danh sách ảnh nhỏ (thumbnail) - cuộn ngang */}
            {images.length > 1 && (
                <div className="thumbnail-strip">
                    <div className="thumbnail-list">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className={`thumbnail-item ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(index)}
                            >
                                <img src={IMAGE_SERVER_URL + img} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageViewer;
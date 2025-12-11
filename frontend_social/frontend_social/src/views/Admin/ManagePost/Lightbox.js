import React from 'react';
import "./Lightbox.css"
const Lightbox = ({ isOpen, image, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="mp-lightbox" onClick={onClose}>
            <div className="mp-lightbox-content" onClick={e => e.stopPropagation()}>
                <img src={image} alt="Zoom" className="mp-lightbox-img" />
                <button className="mp-lightbox-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default Lightbox;
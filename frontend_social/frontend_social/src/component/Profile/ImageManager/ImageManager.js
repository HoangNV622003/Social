import React, { useEffect, useState } from "react";
import { getImage } from "../../../apis/ProfileService";
import "./ImageManager.css";
import { useNavigate } from "react-router-dom";

export default function ImageManager({ userId, token }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchImages() {
            try {
                const res = await getImage(userId, token);
                setImages(res?.data?.content || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchImages();
    }, [userId, token]);

    const handleClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    if (loading) return <p>Đang tải hình ảnh...</p>;

    return (
        <div className="image-grid">
            {images.length === 0 && <p>Không có hình ảnh nào.</p>}
            {images.map((item, index) => (
                <div key={index} className="image-item" onClick={() => handleClick(item.postId)}>
                    <img src={
                        item.image
                    } alt="img" />
                </div>
            ))}
        </div>
    );
}
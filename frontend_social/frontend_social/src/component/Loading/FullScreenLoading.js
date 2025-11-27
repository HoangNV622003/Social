import React from 'react';
import './Loading.css'; // sẽ tạo file CSS dưới đây

const FullScreenLoading = () => {
    return (
        <div className="fullscreen-loading">
            <div className="spinner">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
            </div>
            <p className="loading-text">Đang tải BlockChat...</p>
        </div>
    );
};

export default FullScreenLoading;
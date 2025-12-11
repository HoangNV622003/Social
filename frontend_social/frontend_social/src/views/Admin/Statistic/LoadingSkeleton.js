// src/pages/admin/components/LoadingSkeleton.jsx
import React from 'react';

const LoadingSkeleton = () => (
    <div className="loading-skeleton">
        <div className="skeleton-grid">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="skeleton-card"></div>
            ))}
        </div>
        <div className="skeleton-chart"></div>
    </div>
);

export default LoadingSkeleton;
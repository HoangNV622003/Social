import React from 'react';
import "./Pagination.css"
const Pagination = ({ page, totalPages, onPageChange }) => {
    return (
        <div className="mp-pagination">
            <button
                onClick={() => onPageChange(p => Math.max(0, p - 1))}
                disabled={page === 0}
            >
                ← Trước
            </button>
            <span>Trang {page + 1} / {totalPages}</span>
            <button
                onClick={() => onPageChange(p => p + 1)}
                disabled={page >= totalPages - 1}
            >
                Sau →
            </button>
        </div>
    );
};

export default Pagination;
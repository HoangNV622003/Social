// src/pages/admin/components/YearSelector.jsx
import React from 'react';

const YearSelector = ({ year, onChange }) => {
    const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="year-selector">
            <label>Chọn năm:</label>
            <select value={year} onChange={(e) => onChange(Number(e.target.value))}>
                {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
        </div>
    );
};

export default YearSelector;
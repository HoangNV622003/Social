import React from 'react';

// Function to calculate time difference
const timeAgo = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 1) {
        return `${diffInDays} days ago`;
    } else if (diffInDays === 1) {
        return '1 day ago';
    } else if (diffInHours >= 1) {
        return `${diffInHours}h ago`;
    } else if (diffInMinutes >= 1) {
        return `${diffInMinutes}m ago`;
    } else {
        return 'just now';
    }
};
// Function to calculate time difference
const timeAgo_2 = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp.replace(' ', 'T'));
    const diffInSeconds = Math.floor((now - messageDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 1) {
        return `${diffInDays} days ago`;
    } else if (diffInDays === 1) {
        return '1 day ago';
    } else if (diffInHours >= 1) {
        return `${diffInHours}h ago`;
    } else if (diffInMinutes >= 1) {
        return `${diffInMinutes}m ago`;
    } else {
        return 'just now';
    }
};


export default timeAgo;

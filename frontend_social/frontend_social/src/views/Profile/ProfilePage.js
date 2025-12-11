// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../apis/ProfileService';
import { getAllPosts } from '../../apis/PostService';
import UserAvatar from '../../component/UserAvatar/UserAvatar';
import PostList from '../../component/Post/PostList';
import './ProfilePage.css';
import Navbar from '../../component/Navbar/Navbar';
import FriendRelationshipButton from '../../component/RelationShipButton/FriendRelationshipButton';
import ManageFriend from './Friend/ManageFriend';
import ImageManager from './ImageManager/ImageManager';

const ProfilePage = () => {
    const { userId } = useParams();
    const { token } = useAuth();

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);

    // Hàm tải lại profile (chỉ cần relationship thay đổi)
    const refreshProfile = async () => {
        if (!token || !userId) return;
        try {
            const res = await getUserProfile(userId, token);
            setUser(res.data);
        } catch (err) {
            console.error('Lỗi reload profile:', err);
        }
    };

    // Load thông tin người dùng lần đầu
    useEffect(() => {
        const fetchUser = async () => {
            if (!token || !userId) return;
            try {
                setLoadingUser(true);
                const res = await getUserProfile(userId, token);
                setUser(res.data);
            } catch (err) {
                console.error('Lỗi tải profile:', err);
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUser();
    }, [userId, token]);

    // Load bài viết
    useEffect(() => {
        if (activeTab === 'posts' && token && userId) {
            const fetchPosts = async () => {
                try {
                    setLoadingPosts(true);
                    const response = await getAllPosts(token, userId, 0, 10);
                    setPosts(response.data.content || []);
                } catch (err) {
                    console.error('Lỗi tải bài viết:', err);
                } finally {
                    setLoadingPosts(false);
                }
            };
            fetchPosts();
        }
    }, [activeTab, userId, token]);

    if (loadingUser) return <div className="profile-loading">Đang tải hồ sơ...</div>;
    if (!user) return <div className="profile-error">Không tìm thấy người dùng</div>;

    return (
        <div className="profile-page">
            <Navbar />

            <div className="profile-header">
                <div className="cover-photo">
                    <div className="cover-placeholder"></div>
                </div>

                <div className="profile-info">
                    <div className="avatar-section">
                        <UserAvatar username={user.username} image={user.image} size="large" />
                    </div>

                    <div className="info-section">
                        <h1 className="profile-name">{user.username}</h1>
                        <p className="profile-bio">
                            {user.email} · {user.address || 'Chưa cập nhật địa chỉ'}
                        </p>
                    </div>
                </div>

                {/* Truyền callback để cập nhật lại relationship */}
                <FriendRelationshipButton
                    relationship={user.relationship}
                    profileId={userId}
                    token={token}
                    onActionSuccess={refreshProfile}
                />
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
                <div className="tabs-container">
                    <button
                        className={`tab-item ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        Bài viết
                    </button>
                    <button
                        className={`tab-item ${activeTab === 'friends' ? 'active' : ''}`}
                        onClick={() => setActiveTab('friends')}
                    >
                        Bạn bè
                    </button>
                    <button
                        className={`tab-item ${activeTab === 'photos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('photos')}
                    >
                        Ảnh
                    </button>
                </div>
            </div>

            {/* Nội dung */}
            <div className="profile-content">
                {activeTab === 'posts' && (
                    <div className="tab-posts">
                        <PostList posts={posts} isLoading={loadingPosts} />
                    </div>
                )}
                {activeTab === 'friends' && (
                    <div className="tab-friends">
                        <ManageFriend profileId={userId} />
                    </div>
                )}
                {activeTab === 'photos' && (
                    <div className="tab-photos">
                        <ImageManager userId={userId} token={token} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Profile from '../components/Profile.jsx';
import UserPosts from '../components/UserPosts.jsx';
import FriendsList from '../components/FriendsList.jsx';
import CreatePost from '../components/CreatePost.jsx';
import './ProfilePage.css';

const TABS = ['Posts', 'Albums', 'Friends'];

export default function ProfilePage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('Posts');

    return (
        <div className="page-shell profile-page">
            <Profile />

            <div className="profile-page__grid">
                <div className="profile-page__main">
                    <nav className="profile-page__tabs" aria-label="Profile sections">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                className={`profile-page__tab ${activeTab === tab ? 'profile-page__tab--active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>

                    {activeTab === 'Posts' && <UserPosts />}
                    {activeTab === 'Albums' && (
                        <p className="profile-page__placeholder">
                            Albums for profile #{id} will appear here once album functionality is built.
                        </p>
                    )}
                    {activeTab === 'Friends' && <FriendsList />}

                    <div className="profile-page__create">
                        <CreatePost />
                    </div>
                </div>

                <aside className="profile-page__side">
                    <FriendsList />
                </aside>
            </div>
        </div>
    );
}
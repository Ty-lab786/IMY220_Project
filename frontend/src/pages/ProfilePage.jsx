import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Profile from '../components/Profile.jsx';
import UserPosts from '../components/UserPosts.jsx';
import FriendsList from '../components/FriendsList.jsx';
import CreatePost from '../components/CreatePost.jsx';
import AlbumList from '../components/AlbumList.jsx';
import { api, myId } from '../api.js';
import './ProfilePage.css';

const TABS = ['Posts', 'Albums', 'Friends'];

export default function ProfilePage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('Posts');
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

    const isMe = id === myId();

    useEffect(() => {
        let cancelled = false;
        Promise.all([api(`/users/${id}`), api(`/posts?owner=${id}`)])
            .then(([user, userPosts]) => {
                if (cancelled) return;
                setError('');
                setProfile(user);
                setPosts(userPosts);
            })
            .catch((err) => !cancelled && setError(err.message));
        return () => {
            cancelled = true;
        };
    }, [id, refreshKey]);

    if (error) return <p className="page-shell status status--error">{error}</p>;
    if (!profile) return <p className="page-shell status">Loading profile...</p>;

    return (
        <div className="page-shell profile-page">
            <Profile profile={profile} onUpdated={refresh} />

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

                    {activeTab === 'Posts' && <UserPosts posts={posts} />}
                    {activeTab === 'Albums' && <AlbumList ownerId={id} canCreate={isMe} />}
                    {activeTab === 'Friends' && (
                        <FriendsList
                            userId={id}
                            isMe={isMe}
                            requests={profile.requestsReceived}
                            refreshKey={refreshKey}
                            onChanged={refresh}
                        />
                    )}

                    {isMe && (
                        <div className="profile-page__create">
                            <CreatePost onCreated={refresh} />
                        </div>
                    )}
                </div>

                <aside className="profile-page__side">
                    <section className="card">
                        <h3>About</h3>
                        <p>{profile.bio || 'No bio yet.'}</p>
                        {profile.location && <p>📍 {profile.location}</p>}
                    </section>
                </aside>
            </div>
        </div>
    );
}
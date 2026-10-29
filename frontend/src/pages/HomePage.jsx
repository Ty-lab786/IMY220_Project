import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Feed from '../components/Feed.jsx';
import CreatePost from '../components/CreatePost.jsx';
import ProfilePreview from '../components/ProfilePreview.jsx';
import Avatar from '../components/Avatar.jsx';
import { api } from '../api.js';
import './HomePage.css';

export default function HomePage() {
    const [me, setMe] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [requested, setRequested] = useState(new Set());
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        api('/users/me').then(setMe).catch(() => {});
        api('/users/suggestions').then(setSuggestions).catch(() => {});
    }, [refreshKey]);

    async function sendRequest(id) {
        try {
            await api(`/users/${id}/request`, { method: 'POST' });
            setRequested((prev) => new Set(prev).add(id));
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="page-shell home-page">
            <div className="home-page__grid">
                <div className="home-page__feed">
                    <Feed refreshKey={refreshKey} />
                </div>

                <aside className="home-page__sidebar">
                    {me && (
                        <section className="card home-page__mini-profile">
                            <Link to={`/profile/${me._id}`} className="home-page__mini-identity">
                                <Avatar user={me} className="home-page__mini-avatar" />
                                <div>
                                    <strong>{me.name || me.username}</strong>
                                    <span>@{me.username}</span>
                                </div>
                            </Link>
                            <div className="home-page__mini-stats">
                                <span>{me.stats?.posts ?? 0} posts</span>
                                <span>{me.stats?.friends ?? 0} friends</span>
                                <span>{me.stats?.albums ?? 0} albums</span>
                            </div>
                        </section>
                    )}

                    {suggestions.length > 0 && (
                        <section className="card home-page__suggestions">
                            <h3>People you may know</h3>
                            {suggestions.map((person) => (
                                <ProfilePreview
                                    key={person._id}
                                    user={person}
                                    action={
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            disabled={requested.has(person._id)}
                                            onClick={() => sendRequest(person._id)}
                                        >
                                            {requested.has(person._id) ? 'Requested' : '+ Add'}
                                        </button>
                                    }
                                />
                            ))}
                        </section>
                    )}

                    <CreatePost onCreated={() => setRefreshKey((k) => k + 1)} />
                </aside>
            </div>
        </div>
    );
}
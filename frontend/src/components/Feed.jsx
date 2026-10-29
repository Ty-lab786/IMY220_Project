import { useEffect, useState } from 'react';
import PostPreview from './PostPreview.jsx';
import { api } from '../api.js';
import './Feed.css';

// feed="global" shows everyone's posts, feed="local" shows mine + my friends'
export default function Feed({ refreshKey = 0 }) {
    const [scope, setScope] = useState('global');
    const [sort, setSort] = useState('newest');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        api(`/posts?feed=${scope}`)
            .then((data) => {
                if (cancelled) return;
                setPosts(data);
                setError('');
            })
            .catch((err) => !cancelled && setError(err.message))
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [scope, refreshKey]);

    const sorted = [...posts].sort((a, b) =>
        sort === 'popular'
            ? (b.likes?.length || 0) - (a.likes?.length || 0)
            : new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <section className="feed">
            <div className="feed__controls">
                <div className="feed__scope">
                    {['global', 'local'].map((s) => (
                        <button
                            key={s}
                            type="button"
                            className={`btn btn-outline ${scope === s ? 'feed__scope-btn--active' : ''}`}
                            onClick={() => {
                                if (s !== scope) setLoading(true);
                                setScope(s);
                            }}
                        >
                            {s === 'global' ? 'Global feed' : 'Friends feed'}
                        </button>
                    ))}
                </div>
                <label className="feed__sort">
                    Sort by{' '}
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="newest">Newest</option>
                        <option value="popular">Most liked</option>
                    </select>
                </label>
            </div>

            {loading && <p className="status">Loading feed...</p>}
            {error && <p className="status status--error">{error}</p>}
            {!loading && !error && sorted.length === 0 && (
                <p className="feed__empty">No posts yet. Be the first to share something!</p>
            )}
            {!loading && !error && sorted.map((post) => <PostPreview key={post._id} post={post} />)}
        </section>
    );
}
import { useState } from 'react';
import PostPreview from './PostPreview.jsx';
import { posts as allPosts, friends } from '../data/dummyData.js';
import './Feed.css';

const friendIds = new Set(friends.map((friend) => friend.id));

export default function Feed() {
    const [scope, setScope] = useState('friends');
    const [sort, setSort] = useState('newest');

    const visiblePosts = allPosts
        .filter((post) => (scope === 'friends' ? friendIds.has(post.author.id) || post.author.id === 'user_1' : true))
        .slice()
        .sort((a, b) => (sort === 'popular' ? b.likes - a.likes : 0));

    return (
        <section className="feed" aria-label="Post feed">
            <div className="feed__controls">
                <div className="feed__scope">
                    <button
                        type="button"
                        className={`btn btn-outline ${scope === 'friends' ? 'feed__scope-btn--active' : ''}`}
                        onClick={() => setScope('friends')}
                    >
                        Local feed (friends)
                    </button>
                    <button
                        type="button"
                        className={`btn btn-outline ${scope === 'global' ? 'feed__scope-btn--active' : ''}`}
                        onClick={() => setScope('global')}
                    >
                        Global feed (all users)
                    </button>
                </div>
                <label className="feed__sort">
                    Sort by
                    <select value={sort} onChange={(event) => setSort(event.target.value)}>
                        <option value="newest">Newest</option>
                        <option value="popular">Most liked</option>
                    </select>
                </label>
            </div>

            {visiblePosts.length === 0 ? (
                <p className="feed__empty">No posts to show yet.</p>
            ) : (
                visiblePosts.map((post) => <PostPreview key={post.id} post={post} variant="feed" />)
            )}
        </section>
    );
}
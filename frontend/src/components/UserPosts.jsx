import PostPreview from './PostPreview.jsx';
import { posts } from '../data/dummyData.js';
import './UserPosts.css';

export default function UserPosts() {
    return (
        <section aria-label="User posts">
            {posts.length === 0 ? (
                <p className="user-posts__empty">This user hasn't posted anything yet.</p>
            ) : (
                <div className="user-posts__grid">
                    {posts.map((post) => (
                        <PostPreview key={post.id} post={post} variant="grid" />
                    ))}
                </div>
            )}
        </section>
    );
}
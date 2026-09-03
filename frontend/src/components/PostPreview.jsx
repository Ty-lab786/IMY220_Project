import { Link } from 'react-router-dom';
import './PostPreview.css';

export default function PostPreview({ post, variant = 'feed' }) {
    if (!post) return null;

    if (variant === 'grid') {
        return (
            <Link to={`/post/${post.id}`} className="post-thumb">
                <span className="post-thumb__placeholder">Post image</span>
            </Link>
        );
    }

    return (
        <article className="post-preview card">
            <header className="post-preview__header">
                <Link to={`/profile/${post.author.id}`} className="post-preview__author">
                    <span className="post-preview__avatar" aria-hidden="true">
                        {post.author.name.charAt(0)}
                    </span>
                    <span>
                        <span className="post-preview__name">{post.author.name}</span>
                        <span className="post-preview__time">{post.postedAt}</span>
                    </span>
                </Link>
                <button className="btn btn-ghost" aria-label="More options">
                    &hellip;
                </button>
            </header>

            <Link to={`/post/${post.id}`} className="post-preview__image">
                <span>Post image</span>
            </Link>

            <div className="post-preview__body">
                <p className="post-preview__description">{post.description}</p>
                <ul className="post-preview__tags">
                    {post.hashtags.map((tag) => (
                        <li key={tag}>{tag}</li>
                    ))}
                </ul>
            </div>

            <footer className="post-preview__footer">
                <button className="btn btn-ghost">&#9825; {post.likes}</button>
                <Link to={`/post/${post.id}`} className="btn btn-ghost">
                    &#128172; {post.commentCount} comments
                </Link>
                <button className="btn btn-ghost">Report</button>
                <button className="btn btn-outline post-preview__add-album">Add to album</button>
            </footer>
        </article>
    );
}
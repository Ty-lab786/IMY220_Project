import { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import { api, imgUrl, likeList, myId, timeAgo } from '../api.js';
import './PostPreview.css';

export default function PostPreview({ post, variant = 'feed' }) {
    const [liked, setLiked] = useState(() => likeList(post).some((id) => String(id) === myId()));
    const [likeCount, setLikeCount] = useState(likeList(post).length);

    if (!post) return null;

    if (variant === 'grid') {
        return (
            <Link to={`/post/${post._id}`} className="post-thumb">
                {post.image ? (
                    <img src={imgUrl(post.image)} alt={post.description || 'Post'} />
                ) : (
                    <span className="post-thumb__placeholder">Post image</span>
                )}
            </Link>
        );
    }

    async function toggleLike() {
        try {
            const { liked: nowLiked } = await api(`/posts/${post._id}/like`, { method: 'POST' });
            setLiked(nowLiked);
            setLikeCount((c) => c + (nowLiked ? 1 : -1));
        } catch (err) {
            alert(err.message);
        }
    }

    const author = { name: post.ownerDisplay, username: post.ownerName, avatar: post.ownerAvatar };

    return (
        <article className="post-preview card">
            <header className="post-preview__header">
                <Link to={`/profile/${post.owner}`} className="post-preview__author">
                    <Avatar user={author} className="post-preview__avatar" />
                    <span>
                        <span className="post-preview__name">{post.ownerDisplay || post.ownerName}</span>
                        <span className="post-preview__time">{timeAgo(post.createdAt)}</span>
                    </span>
                </Link>
            </header>

            <Link to={`/post/${post._id}`} className="post-preview__image">
                {post.image ? <img src={imgUrl(post.image)} alt={post.description || 'Post'} /> : <span>Post image</span>}
            </Link>

            <div className="post-preview__body">
                {post.description && <p className="post-preview__description">{post.description}</p>}
                {post.hashtags?.length > 0 && (
                    <ul className="post-preview__tags">
                        {post.hashtags.map((tag) => (
                            <li key={tag}>
                                <Link to={`/search?q=${encodeURIComponent('#' + tag)}`}>#{tag}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <footer className="post-preview__footer">
                <button type="button" className={`btn btn-ghost ${liked ? 'post-preview__liked' : ''}`} onClick={toggleLike}>
                    {liked ? '♥' : '♡'} {likeCount}
                </button>
                <Link to={`/post/${post._id}`} className="btn btn-ghost">
                    💬 {post.commentCount || 0} comments
                </Link>
                <Link to={`/post/${post._id}`} className="btn btn-outline post-preview__add-album">
                    View post
                </Link>
            </footer>
        </article>
    );
}
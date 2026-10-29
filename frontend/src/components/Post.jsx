import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PostImage from './PostImage.jsx';
import EditPost from './EditPost.jsx';
import Avatar from './Avatar.jsx';
import { api, imgUrl, myId, timeAgo } from '../api.js';
import './Post.css';

// Full post view. `postId` comes from the URL (PostPage)
export default function Post({ postId }) {
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [reasons, setReasons] = useState([]);
    const [reportReason, setReportReason] = useState('');
    const [reportMsg, setReportMsg] = useState('');
    const [myAlbums, setMyAlbums] = useState([]);
    const [albumId, setAlbumId] = useState('');
    const [albumMsg, setAlbumMsg] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        api(`/posts/${postId}`).then(setPost).catch((err) => setError(err.message));
    }, [postId, refreshKey]);

    useEffect(() => {
        api('/posts/meta/report-reasons').then(setReasons).catch(() => {});
        api(`/albums?owner=${myId()}`).then(setMyAlbums).catch(() => {});
    }, []);

    if (error) return <p className="status status--error">{error}</p>;
    if (!post) return <p className="status">Loading post...</p>;

    const isOwner = String(post.owner) === myId();
    const liked = (post.likes || []).some((id) => String(id) === myId());

    async function toggleLike() {
        await api(`/posts/${postId}/like`, { method: 'POST' });
        setRefreshKey((k) => k + 1);
    }

    async function handleDelete() {
        if (!window.confirm('Delete this post?')) return;
        try {
            await api(`/posts/${postId}`, { method: 'DELETE' });
            navigate(`/profile/${myId()}`);
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleReport(event) {
        event.preventDefault();
        if (!reportReason) return;
        try {
            await api(`/posts/${postId}/report`, { method: 'POST', body: { reason: reportReason } });
            setReportMsg('Report submitted. Thank you.');
        } catch (err) {
            setReportMsg(err.message);
        }
    }

    async function addToAlbum(event) {
        event.preventDefault();
        if (!albumId) return;
        try {
            await api(`/albums/${albumId}/posts/${postId}`, { method: 'POST' });
            setAlbumMsg('Added to album.');
            setRefreshKey((k) => k + 1);
        } catch (err) {
            setAlbumMsg(err.message);
        }
    }

    if (isEditing) {
        return (
            <EditPost
                post={post}
                onCancel={() => setIsEditing(false)}
                onSave={() => {
                    setIsEditing(false);
                    setRefreshKey((k) => k + 1);
                }}
            />
        );
    }

    const author = { name: post.ownerDisplay, username: post.ownerName, avatar: post.ownerAvatar };

    return (
        <div className="post-page">
            <article className="post-page__main card">
                <header className="post-page__header">
                    <div>
                        <h1>{post.ownerDisplay || post.ownerName}</h1>
                        <p className="post-page__time">Posted {timeAgo(post.createdAt)}</p>
                    </div>
                    <div className="post-page__actions">
                        <button type="button" className="btn btn-outline" onClick={toggleLike}>
                            {liked ? '♥ Liked' : '♡ Like'}
                        </button>
                        {isOwner && (
                            <>
                                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(true)}>
                                    Edit
                                </button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                                    Delete
                                </button>
                            </>
                        )}
                        {!isOwner && (
                            <a href="#report" className="btn btn-outline">
                                Report
                            </a>
                        )}
                    </div>
                </header>

                <PostImage src={imgUrl(post.image)} alt={post.description || 'Post image'} />

                <section className="post-page__description">
                    <h2>Description</h2>
                    <p>{post.description || 'No description.'}</p>
                    <ul className="post-page__tags">
                        {(post.hashtags || []).map((tag) => (
                            <li key={tag}>
                                <Link to={`/search?q=${encodeURIComponent('#' + tag)}`}>#{tag}</Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="post-page__albums">
                    <h2>Part of albums</h2>
                    {(post.albums || []).length === 0 && <p className="post-page__time">Not in any albums yet.</p>}
                    <div className="post-page__albums-grid">
                        {(post.albums || []).map((album) => (
                            <Link key={album._id} to={`/album/${album._id}`} className="post-page__album">
                                <span className="post-page__album-thumb" aria-hidden="true" />
                                <div>
                                    <strong>{album.name}</strong>
                                    <span>View album &rarr;</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </article>

            <aside className="post-page__side">
                <section className="card post-page__side-block">
                    <h3>Posted by</h3>
                    <div className="post-page__poster">
                        <Avatar user={author} className="post-page__poster-avatar" />
                        <div>
                            <strong>{post.ownerDisplay || post.ownerName}</strong>
                            <span>@{post.ownerName}</span>
                        </div>
                    </div>
                    <Link to={`/profile/${post.owner}`} className="btn btn-outline post-page__view-profile">
                        View profile
                    </Link>
                </section>

                <section className="card post-page__side-block">
                    <h3>Post stats</h3>
                    <dl className="post-page__stats">
                        <div>
                            <dt>Likes</dt>
                            <dd>{post.likes?.length || 0}</dd>
                        </div>
                        <div>
                            <dt>Comments</dt>
                            <dd>{post.commentCount || 0}</dd>
                        </div>
                        <div>
                            <dt>Views</dt>
                            <dd>{post.views || 0}</dd>
                        </div>
                    </dl>
                </section>

                {myAlbums.length > 0 && (
                    <section className="card post-page__side-block">
                        <h3>Add to album</h3>
                        <form onSubmit={addToAlbum}>
                            <select value={albumId} onChange={(e) => setAlbumId(e.target.value)}>
                                <option value="">Choose album...</option>
                                {myAlbums.map((a) => (
                                    <option key={a._id} value={a._id}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="btn btn-outline post-page__report-submit" disabled={!albumId}>
                                Add
                            </button>
                            {albumMsg && <p className="post-page__report-sent">{albumMsg}</p>}
                        </form>
                    </section>
                )}

                {!isOwner && (
                    <section className="card post-page__side-block" id="report">
                        <h3>Report post</h3>
                        <form onSubmit={handleReport}>
                            <select value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
                                <option value="">Select reason...</option>
                                {reasons.map((r) => (
                                    <option key={r._id} value={r.label}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="btn btn-outline post-page__report-submit" disabled={!reportReason}>
                                Submit report
                            </button>
                            {reportMsg && <p className="post-page__report-sent">{reportMsg}</p>}
                        </form>
                    </section>
                )}
            </aside>
        </div>
    );
}
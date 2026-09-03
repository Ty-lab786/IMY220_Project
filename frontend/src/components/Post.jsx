import { useState } from 'react';
import { Link } from 'react-router-dom';
import PostImage from './PostImage.jsx';
import EditPost from './EditPost.jsx';
import { posts, reportReasons } from '../data/dummyData.js';
import './Post.css';

export default function Post() {
    const post = posts[0];
    const [isEditing, setIsEditing] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportSent, setReportSent] = useState(false);

    function handleReport(event) {
        event.preventDefault();
        if (!reportReason) return;
        console.log('Report submitted (stub):', reportReason);
        setReportSent(true);
    }

    if (isEditing) {
        return <EditPost post={post} onCancel={() => setIsEditing(false)} onSave={() => setIsEditing(false)} />;
    }

    return (
        <div className="post-page">
            <article className="post-page__main card">
                <header className="post-page__header">
                    <div>
                        <h1>{post.author.name}</h1>
                        <p className="post-page__time">Posted {post.postedAt}</p>
                    </div>
                    <div className="post-page__actions">
                        <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                        <button className="btn btn-outline">Delete</button>
                        <a href="#report" className="btn btn-outline">
                            Report
                        </a>
                    </div>
                </header>

                <PostImage />

                <section className="post-page__description">
                    <h2>Description</h2>
                    <p>{post.description}</p>
                    <ul className="post-page__tags">
                        {post.hashtags.map((tag) => (
                            <li key={tag}>{tag}</li>
                        ))}
                    </ul>
                </section>

                <section className="post-page__albums">
                    <h2>Part of albums</h2>
                    <div className="post-page__albums-grid">
                        {post.albums.map((album) => (
                            <div key={album.id} className="post-page__album">
                                <span className="post-page__album-thumb" aria-hidden="true" />
                                <div>
                                    <strong>{album.name}</strong>
                                    <span>View album &rarr;</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </article>

            <aside className="post-page__side">
                <section className="card post-page__side-block">
                    <h3>Posted by</h3>
                    <div className="post-page__poster">
                        <span className="post-page__poster-avatar" aria-hidden="true">
                            {post.author.name.charAt(0)}
                        </span>
                        <div>
                            <strong>{post.author.name}</strong>
                            <span>47 posts</span>
                        </div>
                    </div>
                    <Link to={`/profile/${post.author.id}`} className="btn btn-outline post-page__view-profile">
                        View profile
                    </Link>
                </section>

                <section className="card post-page__side-block">
                    <h3>Post stats</h3>
                    <dl className="post-page__stats">
                        <div>
                            <dt>Likes</dt>
                            <dd>{post.likes}</dd>
                        </div>
                        <div>
                            <dt>Comments</dt>
                            <dd>{post.commentCount}</dd>
                        </div>
                        <div>
                            <dt>Views</dt>
                            <dd>{post.views}</dd>
                        </div>
                    </dl>
                </section>

                <section className="card post-page__side-block" id="report">
                    <h3>Report post</h3>
                    <form onSubmit={handleReport}>
                        <select value={reportReason} onChange={(event) => setReportReason(event.target.value)}>
                            <option value="">Select reason...</option>
                            {reportReasons.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="btn btn-outline post-page__report-submit" disabled={!reportReason}>
                            Submit report
                        </button>
                        {reportSent && <p className="post-page__report-sent">Report submitted. Thank you.</p>}
                    </form>
                </section>
            </aside>
        </div>
    );
}
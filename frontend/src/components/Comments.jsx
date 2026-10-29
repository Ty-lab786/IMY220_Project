import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import { api, myId, timeAgo } from '../api.js';
import './Comments.css';

export default function Comments({ postId }) {
    const [comments, setComments] = useState([]);
    const [draft, setDraft] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        api(`/posts/${postId}/comments`).then(setComments).catch((err) => setError(err.message));
    }, [postId]);

    async function reload() {
        setComments(await api(`/posts/${postId}/comments`));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!draft.trim()) return;
        if (draft.length > 500) return setError('Comment must be 500 characters or less.');
        try {
            await api(`/posts/${postId}/comments`, { method: 'POST', body: { text: draft.trim() } });
            setDraft('');
            setError('');
            await reload();
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleDelete(commentId) {
        try {
            await api(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
            await reload();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <section className="comments card">
            <h2>Comments ({comments.length})</h2>
            {error && <p className="field-error">{error}</p>}

            <ul className="comments__list">
                {comments.length === 0 && <li className="comments__meta">No comments yet.</li>}
                {comments.map((comment) => (
                    <li key={comment._id} className="comments__item">
                        <Avatar user={comment} className="comments__avatar" />
                        <div style={{ flex: 1 }}>
                            <p className="comments__meta">
                                <Link to={`/profile/${comment.user}`}>
                                    <strong>{comment.username}</strong>
                                </Link>{' '}
                                <span>{timeAgo(comment.createdAt)}</span>
                            </p>
                            <p className="comments__text">{comment.text}</p>
                        </div>
                        {String(comment.user) === myId() && (
                            <button type="button" className="btn btn-ghost" onClick={() => handleDelete(comment._id)}>
                                Delete
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            <form className="comments__form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Add a comment..."
                    aria-label="Add a comment"
                />
                <button type="submit" className="btn btn-gold" disabled={!draft.trim()}>
                    Post
                </button>
            </form>
        </section>
    );
}
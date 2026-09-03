import { useState } from 'react';
import { comments as initialComments } from '../data/dummyData.js';
import './Comments.css';

export default function Comments() {
    const [comments] = useState(initialComments);
    const [draft, setDraft] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        if (!draft.trim()) return;
        console.log('Comment submitted (stub):', draft);
        setDraft('');
    }

    return (
        <section className="comments card">
            <h2>Comments ({comments.length})</h2>

            <ul className="comments__list">
                {comments.map((comment) => (
                    <li key={comment.id} className="comments__item">
                        <span className="comments__avatar" aria-hidden="true">
                            {comment.author.charAt(0)}
                        </span>
                        <div>
                            <p className="comments__meta">
                                <strong>{comment.author}</strong> <span>{comment.postedAt}</span>
                            </p>
                            <p className="comments__text">{comment.text}</p>
                        </div>
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
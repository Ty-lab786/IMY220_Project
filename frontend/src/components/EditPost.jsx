import { useState } from 'react';
import './EditPost.css';

export default function EditPost({ post, onCancel, onSave }) {
    const [description, setDescription] = useState(post?.description || '');
    const [hashtags, setHashtags] = useState((post?.hashtags || []).join(' '));

    function handleSubmit(event) {
        event.preventDefault();
        console.log('Post updated (stub):', { description, hashtags });
        onSave?.({ description, hashtags });
    }

    return (
        <form className="edit-post card" onSubmit={handleSubmit}>
            <h2 className="edit-post__title">Edit post</h2>

            <div className="field">
                <label htmlFor="edit-post-description">Description</label>
                <textarea
                    id="edit-post-description"
                    rows={4}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>

            <div className="field">
                <label htmlFor="edit-post-hashtags">Hashtags</label>
                <input
                    id="edit-post-hashtags"
                    type="text"
                    value={hashtags}
                    onChange={(event) => setHashtags(event.target.value)}
                />
            </div>

            <div className="edit-post__actions">
                <button type="button" className="btn btn-outline" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-gold">
                    Save changes
                </button>
            </div>
        </form>
    );
}
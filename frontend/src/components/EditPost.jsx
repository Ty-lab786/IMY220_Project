import { useState } from 'react';
import { api } from '../api.js';
import './EditPost.css';

export default function EditPost({ post, onCancel, onSave }) {
    const [description, setDescription] = useState(post?.description || '');
    const [hashtags, setHashtags] = useState((post?.hashtags || []).map((t) => `#${t}`).join(' '));
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        if (description.trim().length < 8) return setError('Description must be at least 8 characters.');
        setSaving(true);
        try {
            const updated = await api(`/posts/${post._id}`, { method: 'PUT', body: { description, hashtags } });
            onSave?.(updated);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className="edit-post card" onSubmit={handleSubmit} noValidate>
            <h2 className="edit-post__title">Edit post</h2>

            <div className="field">
                <label htmlFor="edit-post-description">Description</label>
                <textarea
                    id="edit-post-description"
                    rows={4}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className={error ? 'invalid' : ''}
                />
                {error && <p className="field-error">{error}</p>}
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
                <button type="submit" className="btn btn-gold" disabled={saving}>
                    {saving ? 'Saving...' : 'Save changes'}
                </button>
            </div>
        </form>
    );
}
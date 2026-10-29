import { useState } from 'react';
import { api } from '../api.js';
import './CreatePost.css';

const emptyErrors = { image: '', description: '' };

export default function CreatePost({ onCreated }) {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [errors, setErrors] = useState(emptyErrors);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    function validate(nextFile, nextDescription) {
        const nextErrors = { ...emptyErrors };
        if (!nextFile) nextErrors.image = 'Please attach an image for your post.';
        else if (!nextFile.type.startsWith('image/')) nextErrors.image = 'Only image files are allowed.';
        else if (nextFile.size > 5 * 1024 * 1024) nextErrors.image = 'Image must be under 5MB.';
        if (!nextDescription.trim()) nextErrors.description = 'A description is required.';
        else if (nextDescription.trim().length < 8) nextErrors.description = 'Description must be at least 8 characters.';
        setErrors(nextErrors);
        return !nextErrors.image && !nextErrors.description;
    }

    function handleFileChange(event) {
        const picked = event.target.files?.[0] || null;
        setFile(picked);
        validate(picked, description);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setStatus('');
        if (!validate(file, description)) return;

        const form = new FormData();
        form.append('image', file);
        form.append('description', description.trim());
        form.append('hashtags', hashtags);

        setLoading(true);
        try {
            const post = await api('/posts', { method: 'POST', form });
            setStatus('Your post has been shared.');
            setFile(null);
            setDescription('');
            setHashtags('');
            setErrors(emptyErrors);
            event.target.reset();
            onCreated?.(post);
        } catch (err) {
            setStatus(err.message);
        } finally {
            setLoading(false);
        }
    }

    const isValid = file && description.trim().length >= 8;

    return (
        <form className="create-post card" onSubmit={handleSubmit} noValidate>
            <h3 className="create-post__title">Create a post</h3>

            <label className="create-post__drop" htmlFor="post-image">
                {file ? file.name : 'Click to choose an image'}
            </label>
            <input
                id="post-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="create-post__file-input"
            />
            {errors.image && <p className="field-error">{errors.image}</p>}

            <div className="field">
                <label htmlFor="post-description">Description</label>
                <textarea
                    id="post-description"
                    rows={3}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        validate(file, e.target.value);
                    }}
                    className={errors.description ? 'invalid' : ''}
                    placeholder="What's the story behind this shot?"
                />
                {errors.description && <p className="field-error">{errors.description}</p>}
            </div>

            <div className="field">
                <label htmlFor="post-hashtags">Hashtags</label>
                <input
                    id="post-hashtags"
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="#photography #capetown"
                />
            </div>

            <button type="submit" className="btn btn-gold create-post__submit" disabled={!isValid || loading}>
                {loading ? 'Posting...' : 'Post'}
            </button>

            {status && <p className="create-post__success">{status}</p>}
        </form>
    );
}
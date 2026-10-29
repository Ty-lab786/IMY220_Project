import { useState } from 'react';
import { api } from '../api.js';
import './EditProfile.css';

export default function EditProfile({ profile, onCancel, onSave }) {
    const [form, setForm] = useState({
        name: profile.name || '',
        username: profile.username || '',
        location: profile.location || '',
        avatar: profile.avatar || '',
        bio: profile.bio || '',
    });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!form.username.trim()) return setError('Username cannot be empty.');
        if (form.bio.length > 300) return setError('Bio must be 300 characters or less.');
        setSaving(true);
        setError('');
        try {
            const updated = await api(`/users/${profile._id}`, { method: 'PUT', body: form });
            onSave?.(updated);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className="edit-profile card" onSubmit={handleSubmit} noValidate>
            <h2 className="edit-profile__title">Edit profile</h2>
            {error && <p className="field-error">{error}</p>}

            <div className="field">
                <label htmlFor="edit-name">Display name</label>
                <input id="edit-name" name="name" type="text" value={form.name} onChange={handleChange} />
            </div>

            <div className="field">
                <label htmlFor="edit-username">Username</label>
                <input id="edit-username" name="username" type="text" value={form.username} onChange={handleChange} />
            </div>

            <div className="field">
                <label htmlFor="edit-location">Location</label>
                <input id="edit-location" name="location" type="text" value={form.location} onChange={handleChange} />
            </div>

            <div className="field">
                <label htmlFor="edit-avatar">Avatar image URL</label>
                <input id="edit-avatar" name="avatar" type="url" value={form.avatar} onChange={handleChange} />
            </div>

            <div className="field">
                <label htmlFor="edit-bio">Bio</label>
                <textarea id="edit-bio" name="bio" rows={4} value={form.bio} onChange={handleChange} />
            </div>

            <div className="edit-profile__actions">
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
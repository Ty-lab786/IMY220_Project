import { useState } from 'react';
import { currentUser } from '../data/dummyData.js';
import './EditProfile.css';

export default function EditProfile({ onCancel, onSave }) {
    const [form, setForm] = useState({
        name: currentUser.name,
        bio: currentUser.bio,
        location: currentUser.location,
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log('Profile saved (stub):', form);
        onSave?.(form);
    }

    return (
        <form className="edit-profile card" onSubmit={handleSubmit}>
            <h2 className="edit-profile__title">Edit profile</h2>

            <div className="field">
                <label htmlFor="edit-name">Display name</label>
                <input id="edit-name" name="name" type="text" value={form.name} onChange={handleChange} />
            </div>

            <div className="field">
                <label htmlFor="edit-location">Location</label>
                <input id="edit-location" name="location" type="text" value={form.location} onChange={handleChange} />
            </div>

            <div className="field">
                <label htmlFor="edit-bio">Bio</label>
                <textarea id="edit-bio" name="bio" rows={4} value={form.bio} onChange={handleChange} />
            </div>

            <div className="edit-profile__actions">
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
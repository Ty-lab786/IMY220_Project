import { useState } from 'react';
import { currentUser } from '../data/dummyData.js';
import EditProfile from './EditProfile.jsx';
import './Profile.css';

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return <EditProfile onCancel={() => setIsEditing(false)} onSave={() => setIsEditing(false)} />;
    }

    return (
        <section className="profile-header">
            <div className="profile-header__cover">Cover / banner image</div>

            <div className="profile-header__main">
                <span className="profile-header__avatar" aria-hidden="true">
                    {currentUser.name.charAt(0)}
                </span>

                <div className="profile-header__info">
                    <h1>{currentUser.name}</h1>
                    <p className="profile-header__meta">
                        {currentUser.handle} &middot; Joined {currentUser.joined}
                    </p>
                    <ul className="profile-header__tags">
                        {currentUser.tags.map((tag) => (
                            <li key={tag}>{tag}</li>
                        ))}
                    </ul>
                </div>

                <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                    Edit profile
                </button>
            </div>

            <p className="profile-header__bio">{currentUser.bio}</p>

            <div className="profile-header__stats">
                <div>
                    <strong>{currentUser.stats.posts}</strong>
                    <span>Posts</span>
                </div>
                <div>
                    <strong>{currentUser.stats.albums}</strong>
                    <span>Albums</span>
                </div>
                <div>
                    <strong>{currentUser.stats.friends}</strong>
                    <span>Friends</span>
                </div>
            </div>

            <div className="profile-header__links">
                {currentUser.links.map((link) => (
                    <a key={link.label} href={link.url}>
                        {link.label}
                    </a>
                ))}
            </div>
        </section>
    );
}
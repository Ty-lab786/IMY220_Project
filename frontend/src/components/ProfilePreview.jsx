import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import './ProfilePreview.css';

export default function ProfilePreview({ user, action }) {
    if (!user) return null;
    return (
        <div className="profile-preview">
            <Link to={`/profile/${user._id}`} className="profile-preview__identity">
                <Avatar user={user} className="profile-preview__avatar" />
                <span className="profile-preview__text">
                    <span className="profile-preview__name">{user.name || user.username}</span>
                    <span className="profile-preview__handle">@{user.username}</span>
                </span>
            </Link>
            {action}
        </div>
    );
}
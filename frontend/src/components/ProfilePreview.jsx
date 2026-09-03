import { Link } from 'react-router-dom';
import './ProfilePreview.css';

export default function ProfilePreview({ user, action }) {
    return (
        <div className="profile-preview">
            <Link to={`/profile/${user.id}`} className="profile-preview__identity">
                <span className="profile-preview__avatar" aria-hidden="true">
                    {user.name.charAt(0)}
                </span>
                <span className="profile-preview__text">
                    <span className="profile-preview__name">{user.name}</span>
                    <span className="profile-preview__handle">{user.handle}</span>
                </span>
            </Link>
            {action}
        </div>
    );
}
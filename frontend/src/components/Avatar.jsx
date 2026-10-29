import { imgUrl } from '../api.js';

// Shows the user's photo, or the first letter of their name if they have none.
export default function Avatar({ user, className }) {
    const name = user?.name || user?.username || user?.ownerName || '?';
    const src = user?.avatar;
    return (
        <span className={className} aria-hidden="true">
            {src ? <img src={imgUrl(src)} alt="" /> : name.charAt(0).toUpperCase()}
        </span>
    );
}
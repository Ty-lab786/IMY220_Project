import { Link, NavLink, useNavigate } from 'react-router-dom';
import { api, clearSession, myId } from '../api.js';
import SearchInput from './SearchInput.jsx';
import './Header.css';

export default function Header() {
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await api('/auth/logout', { method: 'POST' });
        } catch {
            // logging out locally is enough even if the request fails
        }
        clearSession();
        navigate('/');
    }

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/home" className="brand-logo">
                    <span className="brand-logo__mark">PM</span> PictureMe
                </Link>

                <SearchInput />

                <nav className="nav-links">
                    <NavLink to="/home" className="nav-item">Feed</NavLink>
                    <NavLink to={`/profile/${myId()}`} className="nav-item">Profile</NavLink>
                    <button type="button" onClick={handleLogout} className="btn btn-outline logout-btn">
                        Log out
                    </button>
                </nav>
            </div>
        </header>
    );
}
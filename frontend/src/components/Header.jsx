import { Link, NavLink } from 'react-router-dom';
import { currentUser } from '../data/dummyData.js';
import SearchInput from './SearchInput.jsx';
import './Header.css';

export default function Header() {
    return (
        <header className="site-header">
            <Link to="/home" className="site-header__brand">
                <span className="site-header__mark" aria-hidden="true">
                    PM
                </span>
                PictureMe
            </Link>

            <SearchInput />

            <nav className="site-header__nav" aria-label="Primary">
                <NavLink to="/home" className="site-header__link">
                    Home
                </NavLink>
                <NavLink to={`/profile/${currentUser.id}`} className="site-header__link">
                    Profile
                </NavLink>
                <NavLink to="/post/post_1" className="site-header__link">
                    Post
                </NavLink>
                <Link to={`/profile/${currentUser.id}`} className="site-header__avatar" title={currentUser.name}>
                    {currentUser.name.charAt(0)}
                </Link>
                <Link to="/" className="site-header__link site-header__link--muted">
                    Log out
                </Link>
            </nav>
        </header>
    );
}
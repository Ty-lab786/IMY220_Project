import { useState } from 'react';
import './SearchInput.css';

export default function SearchInput({ placeholder = 'Search users, posts, hashtags...' }) {
    const [term, setTerm] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        console.log('Search submitted (not yet implemented):', term);
    }

    return (
        <form className="search-input" role="search" onSubmit={handleSubmit}>
            <span className="search-input__icon" aria-hidden="true">
                ⌕
            </span>
            <input
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder={placeholder}
                aria-label="Search users, posts and hashtags"
            />
        </form>
    );
}
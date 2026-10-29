import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import './Album.css';

// List of albums for one user (+ create form if it's my profile)
export default function AlbumList({ ownerId, canCreate }) {
    const [albums, setAlbums] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        api(`/albums?owner=${ownerId}`)
            .then((data) => !cancelled && setAlbums(data))
            .catch((err) => !cancelled && setError(err.message))
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [ownerId, refreshKey]);

    async function handleCreate(e) {
        e.preventDefault();
        if (!name.trim()) return setError('Album name is required.');
        setError('');
        try {
            await api('/albums', { method: 'POST', body: { name: name.trim(), description } });
            setName('');
            setDescription('');
            setRefreshKey((k) => k + 1);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="albums">
            {canCreate && (
                <form onSubmit={handleCreate} className="card albums__form" noValidate>
                    <h3>Create new album</h3>
                    <div className="field">
                        <label htmlFor="album-name">Album name</label>
                        <input id="album-name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="album-desc">Description</label>
                        <textarea id="album-desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    {error && <p className="field-error">{error}</p>}
                    <button type="submit" className="btn btn-gold" disabled={!name.trim()}>
                        Create album
                    </button>
                </form>
            )}

            {loading && <p className="status">Loading albums...</p>}
            {!loading && albums.length === 0 && <p className="user-posts__empty">No albums yet.</p>}

            <div className="albums__grid">
                {albums.map((album) => (
                    <Link key={album._id} to={`/album/${album._id}`} className="card albums__item">
                        <h3>{album.name}</h3>
                        {album.description && <p>{album.description}</p>}
                        <span className="albums__count">{album.posts?.length || 0} photos</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
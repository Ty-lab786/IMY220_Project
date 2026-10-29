import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PostPreview from './PostPreview.jsx';
import { api, myId } from '../api.js';
import './Album.css';
import './UserPosts.css';

// Album detail page: /album/:id
export default function Album() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        api(`/albums/${id}`)
            .then((data) => {
                setAlbum(data);
                setForm({ name: data.name, description: data.description || '' });
            })
            .catch((err) => setError(err.message));
    }, [id, refreshKey]);

    if (error && !album) return <p className="page-shell status status--error">{error}</p>;
    if (!album) return <p className="page-shell status">Loading album...</p>;

    const isOwner = String(album.owner) === myId();

    async function save(e) {
        e.preventDefault();
        if (!form.name.trim()) return setError('Album name cannot be empty.');
        try {
            await api(`/albums/${id}`, { method: 'PUT', body: form });
            setEditing(false);
            setError('');
            setRefreshKey((k) => k + 1);
        } catch (err) {
            setError(err.message);
        }
    }

    async function remove() {
        if (!window.confirm('Delete this album? The posts themselves will not be deleted.')) return;
        await api(`/albums/${id}`, { method: 'DELETE' });
        navigate(`/profile/${myId()}`);
    }

    async function removePost(postId) {
        await api(`/albums/${id}/posts/${postId}`, { method: 'DELETE' });
        setRefreshKey((k) => k + 1);
    }

    return (
        <div className="page-shell">
            <section className="card">
                {editing ? (
                    <form onSubmit={save} noValidate>
                        <div className="field">
                            <label htmlFor="album-edit-name">Name</label>
                            <input id="album-edit-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="field">
                            <label htmlFor="album-edit-desc">Description</label>
                            <textarea id="album-edit-desc" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </div>
                        {error && <p className="field-error">{error}</p>}
                        <div className="album-page__actions">
                            <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                            <button type="submit" className="btn btn-gold">Save</button>
                        </div>
                    </form>
                ) : (
                    <div className="album-page__header">
                        <div>
                            <h1>{album.name}</h1>
                            {album.description && <p>{album.description}</p>}
                            <p>
                                by <Link to={`/profile/${album.owner}`}>@{album.ownerName}</Link> · {album.posts.length} photos
                            </p>
                        </div>
                        {isOwner && (
                            <div className="album-page__actions">
                                <button type="button" className="btn btn-outline" onClick={() => setEditing(true)}>Edit</button>
                                <button type="button" className="btn btn-danger" onClick={remove}>Delete</button>
                            </div>
                        )}
                    </div>
                )}

                {album.posts.length === 0 ? (
                    <p className="user-posts__empty">No photos in this album yet. Add one from a post page.</p>
                ) : (
                    <div className="user-posts__grid">
                        {album.posts.map((post) => (
                            <div key={post._id} className="album-page__thumb">
                                <PostPreview post={post} variant="grid" />
                                {isOwner && (
                                    <button type="button" className="btn btn-outline album-page__remove" onClick={() => removePost(post._id)}>
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
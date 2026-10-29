import { useEffect, useState } from 'react';
import ProfilePreview from './ProfilePreview.jsx';
import { api } from '../api.js';
import './FriendsList.css';

// Shows the friends of `userId`. If it's my own profile, also shows incoming requests.
export default function FriendsList({ userId, isMe, requests, refreshKey = 0, onChanged }) {
    const reqKey = (requests || []).map(String).join(',');
    const [friends, setFriends] = useState([]);
    const [requesters, setRequesters] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userId) return;
        api(`/users/${userId}/friends`).then(setFriends).catch((err) => setError(err.message));
    }, [userId, refreshKey]);

    useEffect(() => {
        if (!isMe || !reqKey) return;
        Promise.all(reqKey.split(',').map((id) => api(`/users/${id}`).catch(() => null))).then((list) =>
            setRequesters(list.filter(Boolean))
        );
    }, [isMe, reqKey]);

    async function act(id, path, method = 'POST') {
        try {
            await api(`/users/${id}/${path}`, { method });
            onChanged?.();
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="friends-list">
            {isMe && reqKey && requesters.length > 0 && (
                <section className="card friends-list__section">
                    <h3>Friend requests</h3>
                    {requesters.map((person) => (
                        <ProfilePreview
                            key={person._id}
                            user={person}
                            action={
                                <span style={{ display: 'flex', gap: '0.35rem' }}>
                                    <button type="button" className="btn btn-gold" onClick={() => act(person._id, 'accept')}>
                                        Accept
                                    </button>
                                    <button type="button" className="btn btn-outline" onClick={() => act(person._id, 'decline')}>
                                        Decline
                                    </button>
                                </span>
                            }
                        />
                    ))}
                </section>
            )}

            <section className="card friends-list__section">
                <h3>Friends ({friends.length})</h3>
                {error && <p className="field-error">{error}</p>}
                {friends.length === 0 && <p className="user-posts__empty">No friends yet.</p>}
                {friends.map((friend) => (
                    <ProfilePreview
                        key={friend._id}
                        user={friend}
                        action={
                            isMe && (
                                <button type="button" className="btn btn-outline" onClick={() => act(friend._id, 'friend', 'DELETE')}>
                                    Unfriend
                                </button>
                            )
                        }
                    />
                ))}
            </section>
        </div>
    );
}
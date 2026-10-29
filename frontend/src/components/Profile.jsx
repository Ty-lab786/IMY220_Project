import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import EditProfile from './EditProfile.jsx';
import { api, clearSession, myId } from '../api.js';
import './Profile.css';

// Profile header. `profile` comes from ProfilePage (GET /api/users/:id)
export default function Profile({ profile, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  if (!profile) return null;

  const isMe = profile._id === myId();
  const me = { _id: myId() };
  const isFriend = (profile.friends || []).some((id) => String(id) === me._id);
  const iRequested = (profile.requestsReceived || []).some((id) => String(id) === me._id);
  const theyRequested = (profile.requestsSent || []).some((id) => String(id) === me._id);

  async function friendAction(path, method = 'POST') {
    try {
      await api(`/users/${profile._id}/${path}`, { method });
      onUpdated?.();
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteAccount() {
    if (!window.confirm('Delete your account and all your posts? This cannot be undone.')) return;
    try {
      await api(`/users/${profile._id}`, { method: 'DELETE' });
      clearSession();
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  }

  if (editing) {
    return (
      <EditProfile
        profile={profile}
        onCancel={() => setEditing(false)}
        onSave={() => {
          setEditing(false);
          onUpdated?.();
        }}
      />
    );
  }

  return (
    <section className="profile-header card">
      <div className="profile-header__cover" />
      <div className="profile-header__main">
        <Avatar user={profile} className="profile-header__avatar" />
        <div className="profile-header__info">
          <h1>{profile.name || profile.username}</h1>
          <p className="profile-header__meta">
            @{profile.username}
            {profile.location ? ` · ${profile.location}` : ''}
            {profile.createdAt ? ` · Joined ${new Date(profile.createdAt).toLocaleDateString()}` : ''}
          </p>
        </div>

        <div className="profile-header__links">
          {isMe ? (
            <>
              <button type="button" className="btn btn-outline" onClick={() => setEditing(true)}>Edit profile</button>
              <button type="button" className="btn btn-danger" onClick={deleteAccount}>Delete account</button>
            </>
          ) : isFriend ? (
            <button type="button" className="btn btn-outline" onClick={() => friendAction('friend', 'DELETE')}>Unfriend</button>
          ) : theyRequested ? (
            <>
              <button type="button" className="btn btn-gold" onClick={() => friendAction('accept')}>Accept request</button>
              <button type="button" className="btn btn-outline" onClick={() => friendAction('decline')}>Decline</button>
            </>
          ) : iRequested ? (
            <button type="button" className="btn btn-outline" disabled>Request sent</button>
          ) : (
            <button type="button" className="btn btn-gold" onClick={() => friendAction('request')}>+ Add friend</button>
          )}
        </div>
      </div>

      <p className="profile-header__bio">{profile.bio || 'No bio yet.'}</p>

      <div className="profile-header__stats">
        <div><strong>{profile.stats?.posts ?? 0}</strong> posts</div>
        <div><strong>{profile.stats?.albums ?? 0}</strong> albums</div>
        <div><strong>{profile.stats?.friends ?? 0}</strong> friends</div>
      </div>
    </section>
  );
}
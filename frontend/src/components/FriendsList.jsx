import { useState } from 'react';
import ProfilePreview from './ProfilePreview.jsx';
import { friends, suggestedFriends } from '../data/dummyData.js';
import './FriendsList.css';

export default function FriendsList() {
    const [followingIds, setFollowingIds] = useState(new Set());

    function toggleFollow(id) {
        setFollowingIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    return (
        <div className="friends-list">
            <section className="card friends-list__section">
                <h3>Friends</h3>
                {friends.map((friend) => (
                    <ProfilePreview
                        key={friend.id}
                        user={friend}
                        action={
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => toggleFollow(friend.id)}
                            >
                                {followingIds.has(friend.id) ? 'Following' : 'Friends'}
                            </button>
                        }
                    />
                ))}
                <button type="button" className="btn btn-ghost friends-list__view-all">
                    View all friends
                </button>
            </section>

            <section className="card friends-list__section">
                <h3>Suggested friends</h3>
                {suggestedFriends.map((person) => (
                    <ProfilePreview
                        key={person.id}
                        user={person}
                        action={
                            <button type="button" className="btn btn-outline" onClick={() => toggleFollow(person.id)}>
                                {followingIds.has(person.id) ? 'Requested' : '+ Add'}
                            </button>
                        }
                    />
                ))}
            </section>
        </div>
    );
}
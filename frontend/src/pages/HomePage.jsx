import { Link } from 'react-router-dom';
import Feed from '../components/Feed.jsx';
import CreatePost from '../components/CreatePost.jsx';
import ProfilePreview from '../components/ProfilePreview.jsx';
import { currentUser, suggestedFriends } from '../data/dummyData.js';
import './HomePage.css';

export default function HomePage() {
    return (
        <div className="page-shell home-page">
            <div className="home-page__grid">
                <div className="home-page__feed">
                    <Feed />
                </div>

                <aside className="home-page__sidebar">
                    <section className="card home-page__mini-profile">
                        <Link to={`/profile/${currentUser.id}`} className="home-page__mini-identity">
                            <span className="home-page__mini-avatar" aria-hidden="true">
                                {currentUser.name.charAt(0)}
                            </span>
                            <div>
                                <strong>{currentUser.name}</strong>
                                <span>{currentUser.handle}</span>
                            </div>
                        </Link>
                        <div className="home-page__mini-stats">
                            <span>{currentUser.stats.posts} posts</span>
                            <span>{currentUser.stats.friends} friends</span>
                            <span>{currentUser.stats.albums} albums</span>
                        </div>
                    </section>

                    <section className="card home-page__suggestions">
                        <h3>People you may know</h3>
                        {suggestedFriends.map((person) => (
                            <ProfilePreview
                                key={person.id}
                                user={person}
                                action={
                                    <button type="button" className="btn btn-outline">
                                        + Add
                                    </button>
                                }
                            />
                        ))}
                    </section>

                    <CreatePost />
                </aside>
            </div>
        </div>
    );
}
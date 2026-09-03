import { useState } from 'react';
import LoginForm from '../components/LoginForm.jsx';
import SignupForm from '../components/SignupForm.jsx';
import './SplashPage.css';
import heroImage from '../assets/HomePage.avif';

export default function SplashPage() {
  const [mode, setMode] = useState('login');

  return (
    <div className="splash">
      <section className="splash__hero">
        <img src={heroImage} alt="Camera lens close-up" className="splash__hero-image" />

        <div className="splash__hero-content">
          <div className="splash__brand">
            <span className="splash__brand-mark" aria-hidden="true">
              PM
            </span>
            PictureMe
          </div>

          <p className="splash__eyebrow">Photo sharing, reimagined</p>
          <h1 className="splash__headline">
            Your moments,
            <br />
            <em>beautifully</em>
            <br />
            shared.
          </h1>
          <p className="splash__lede">
            PictureMe is where photographers and visual storytellers share their best work,
            discover stunning imagery, and connect with a like-minded community.
          </p>
        </div>
      </section>

      <section className="splash__panel">
        <div className="splash__tabs" role="tablist" aria-label="Authentication">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={`splash__tab ${mode === 'login' ? 'splash__tab--active' : ''}`}
            onClick={() => setMode('login')}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={`splash__tab ${mode === 'signup' ? 'splash__tab--active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>

        {mode === 'login' ? (
          <>
            <h2 className="splash__panel-title">Welcome back</h2>
            <p className="splash__panel-sub">Sign in to access your feed and photos.</p>
            <LoginForm />
            <p className="splash__switch">
              Don&rsquo;t have an account?{' '}
              <button type="button" onClick={() => setMode('signup')}>
                Sign up free
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="splash__panel-title">Join PictureMe</h2>
            <p className="splash__panel-sub">Create an account to start sharing.</p>
            <SignupForm />
            <p className="splash__switch">
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')}>
                Log in
              </button>
            </p>
          </>
        )}
      </section>
    </div>
  );
}
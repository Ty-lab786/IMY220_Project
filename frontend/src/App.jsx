import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from './api.js';

import Header from './components/Header.jsx';
import SplashPage from './pages/SplashPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PostPage from './pages/PostPage.jsx';
import Album from './components/Album.jsx';
import Search from './components/Search.jsx';

function Protected({ children }) {
  return isLoggedIn() ? children : <Navigate to="/" replace />;
}

export default function App() {
  const { pathname } = useLocation();
  const onSplash = pathname === '/';

  return (
    <div className="app-container">
      {!onSplash && <Header />}
      <Routes>
        <Route path="/" element={isLoggedIn() ? <Navigate to="/home" replace /> : <SplashPage />} />
        <Route path="/home" element={<Protected><HomePage /></Protected>} />
        <Route path="/profile/:id" element={<Protected><ProfilePage /></Protected>} />
        <Route path="/post/:id" element={<Protected><PostPage /></Protected>} />
        <Route path="/album/:id" element={<Protected><Album /></Protected>} />
        <Route path="/search" element={<Protected><Search /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

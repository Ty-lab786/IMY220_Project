import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import SplashPage from './pages/SplashPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PostPage from './pages/PostPage.jsx';

function AppLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route
        path="/home"
        element={
          <AppLayout>
            <HomePage />
          </AppLayout>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        }
      />
      <Route
        path="/post/:id"
        element={
          <AppLayout>
            <PostPage />
          </AppLayout>
        }
      />
      <Route
        path="*"
        element={
          <AppLayout>
            <p style={{ padding: '2rem' }}>Page not found.</p>
          </AppLayout>
        }
      />
    </Routes>
  );
}


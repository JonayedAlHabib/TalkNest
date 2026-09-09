import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import useAuthStore from './store/authStore'
import Navbar from './components/shared/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const NotificationPage = lazy(() => import('./pages/NotificationPage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400">Loading...</p>
    </div>
  )
}

function App() {
  const { authUser, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <>
      {authUser && <Navbar />}
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/" replace />} />

          {/* Protected routes */}
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" replace />} />
          <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />} />
          <Route path="/search" element={authUser ? <SearchPage /> : <Navigate to="/login" replace />} />
          <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" replace />} />
          <Route path="/messages" element={authUser ? <ChatPage /> : <Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App

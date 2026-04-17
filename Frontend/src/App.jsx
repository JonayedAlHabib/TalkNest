import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'
import Navbar from './components/shared/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/SearchPage'
import NotificationPage from './pages/NotificationPage'
import ChatPage from './pages/ChatPage'

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
    </>
  )
}

export default App
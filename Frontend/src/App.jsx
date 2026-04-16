import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useCallback } from 'react'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import useAuthStore from './store/authStore'

function App() {
  const { authUser, isLoading, checkAuth, logout } = useAuthStore()
  
  const memoCheckAuth = useCallback(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    memoCheckAuth()
  }, [memoCheckAuth])

  // check হওয়ার আগে loading দেখাও
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={authUser ? (
          <div className="p-10">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Home Feed</h1>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
            <p className="text-gray-600">Welcome, {authUser.fullName || authUser.username}!</p>
          </div>
        ) : (
          <Navigate to="/login" replace />
        )}
      />
      <Route
        path="/login"
        element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/register"
        element={!authUser ? <RegisterPage /> : <Navigate to="/" replace />}
      />
    </Routes>
  )
}

export default App
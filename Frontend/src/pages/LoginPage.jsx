import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axios'
import useAuthStore from '../store/authStore'

function LoginPage() {
  const navigate = useNavigate()
  const setAuthUser = useAuthStore((state) => state.setAuthUser)

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axiosInstance.post('/auth/login', formData)
      setAuthUser(res.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 relative">
      <Link
        to="/"
        className="absolute top-5 left-5 flex items-center gap-1.5 text-sm text-ink-dim hover:text-ink transition"
      >
        <span aria-hidden="true">←</span> Back
      </Link>

      <div className="bg-paper-raised w-full max-w-md rounded-2xl shadow-md p-8">

        <h1 className="font-display italic text-3xl text-center text-ink mb-1">TalkNest</h1>
        <p className="text-center text-ink-dim text-sm mb-6">Login to your account</p>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-line-strong rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-line-strong rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-600 text-accent-ink py-2 rounded-lg text-sm font-medium hover:bg-accent-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-dim mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage

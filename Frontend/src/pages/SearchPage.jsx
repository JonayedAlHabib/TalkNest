import { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../utils/axios'

function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (value) => {
    setQuery(value)
    if (!value.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await axiosInstance.get(`/users/search?query=${value}`)
      setResults(res.data)
    } catch (error) {
      console.error('Search error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (userId, index) => {
    try {
      await axiosInstance.post(`/follow/send/${userId}`)
      const updated = [...results]
      updated[index].requested = true
      setResults(updated)
    } catch (error) {
      console.error('Follow error:', error.message)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-24">

      {/* Search Input */}
      <div className="bg-paper-raised border border-line rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
        <span className="text-ink-dim">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name or username..."
          className="flex-1 outline-none text-sm text-ink placeholder-ink-dim bg-transparent"
        />
        {query && (
          <button onClick={() => handleSearch('')} className="text-ink-dim text-lg">×</button>
        )}
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-ink-dim text-sm py-4">Searching...</p>}

      {/* No results */}
      {!loading && query && results.length === 0 && (
        <p className="text-center text-ink-dim text-sm py-8">No users found for "{query}"</p>
      )}

      {/* Empty state */}
      {!query && (
        <p className="text-center text-ink-dim text-sm py-8">Type a name to search users</p>
      )}

      {/* Results */}
      {results.map((user, index) => (
        <div key={user._id} className="bg-paper-raised border border-line rounded-2xl px-4 py-3 mb-2 flex items-center gap-3">

          {/* Avatar */}
          <Link to={`/profile/${user.username}`}>
            <div className="w-11 h-11 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-semibold">
              {user.profilePicture
                ? <img src={user.profilePicture} className="w-11 h-11 rounded-full object-cover" alt="" />
                : user.fullName?.charAt(0).toUpperCase()
              }
            </div>
          </Link>

          {/* Info */}
          <Link to={`/profile/${user.username}`} className="flex-1">
            <p className="text-sm font-medium text-ink">{user.fullName}</p>
            <p className="text-xs text-ink-dim">@{user.username}</p>
          </Link>

          {/* Follow Button */}
          <button
            onClick={() => handleFollow(user._id, index)}
            disabled={user.requested}
            className={`text-xs px-4 py-1.5 rounded-full transition
              ${user.requested
                ? 'bg-accent-200 text-ink cursor-not-allowed'
                : 'bg-accent-600 text-accent-ink hover:bg-accent-700'
              }`}
          >
            {user.requested ? 'Requested' : 'Follow'}
          </button>
        </div>
      ))}
    </div>
  )
}

export default SearchPage

import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import axiosInstance from '../../utils/axios'

function CreatePost({ onPostCreated }) {
  const { authUser } = useAuthStore()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return
    setLoading(true)
    try {
      await axiosInstance.post('/posts', { content })
      setContent('')
      onPostCreated()
    } catch (error) {
      console.error('Post error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4">
      <div className="flex gap-3">

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
          {authUser?.fullName?.charAt(0).toUpperCase()}
        </div>

        {/* Input */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full resize-none border-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
          />
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
            <span className={`text-xs ${content.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
              {content.length}/500
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="bg-blue-600 text-white text-sm px-5 py-1.5 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
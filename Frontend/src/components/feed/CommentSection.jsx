import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axios'
import useAuthStore from '../../store/authStore'

function CommentSection({ postId }) {
  const { authUser } = useAuthStore()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/comments/${postId}`)
      setComments(res.data.comments || res.data)
    } catch (error) {
      console.error('Comments error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!text.trim()) return
    setSubmitting(true)
    try {
      const res = await axiosInstance.post(`/comments/${postId}`, { text })
      setComments(prev => [res.data.comment, ...prev])
      setText('')
    } catch (error) {
      console.error('Comment error:', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`)
      setComments(prev => prev.filter(c => c._id !== commentId))
    } catch (error) {
      console.error('Delete error:', error.message)
    }
  }

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date)
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">

      {/* Comment Input */}
      <div className="flex gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0">
          {authUser?.fullName?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Write a comment..."
            className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-sm outline-none text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !text.trim()}
            className="text-blue-600 text-sm font-medium disabled:opacity-40"
          >
            Post
          </button>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <p className="text-xs text-gray-400 text-center py-2">Loading...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-2">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => (
            <div key={comment._id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0">
                {comment.author?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl px-3 py-2">
                  <p className="text-xs font-medium text-gray-900 mb-0.5">
                    {comment.author?.fullName}
                    <span className="text-gray-400 font-normal ml-1">@{comment.author?.username}</span>
                  </p>
                  <p className="text-sm text-gray-800">{comment.text}</p>
                </div>
                <div className="flex items-center gap-3 mt-1 px-1">
                  <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
                  {comment.author?._id === authUser?._id && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection
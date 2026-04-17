import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import axiosInstance from '../../utils/axios'
import CommentSection from './CommentSection'   // ← import

function PostCard({ post, onUpdate }) {
  const { authUser } = useAuthStore()
  const [liked, setLiked] = useState(post.likes?.includes(authUser?._id))
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0)
  const [showMenu, setShowMenu] = useState(false)
  const [showComments, setShowComments] = useState(false)  // ← add

  const isOwner = post.author?._id === authUser?._id

  const handleLike = async () => {
    try {
      if (liked) {
        await axiosInstance.delete(`/posts/${post._id}/like`)
        setLikeCount(prev => prev - 1)
      } else {
        await axiosInstance.post(`/posts/${post._id}/like`)
        setLikeCount(prev => prev + 1)
      }
      setLiked(!liked)
    } catch (error) {
      console.error('Like error:', error.message)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return
    try {
      await axiosInstance.delete(`/posts/${post._id}`)
      onUpdate()
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
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-3">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Link to={`/profile/${post.author?.username}`} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm overflow-hidden">
            {post.author?.profilePicture
              ? <img src={post.author.profilePicture} className="w-10 h-10 object-cover" alt="" />
              : post.author?.fullName?.charAt(0).toUpperCase()
            }
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{post.author?.fullName}</p>
            <p className="text-xs text-gray-400">
              @{post.author?.username} · {formatTime(post.createdAt)}
            </p>
          </div>
        </Link>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 px-2 text-lg"
            >
              ···
            </button>
            {showMenu && (
              <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-xl z-10 min-w-28">
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-gray-800 leading-relaxed mb-3">{post.content}</p>

      {/* Post Image */}
      {post.image && (
        <div className="mb-3 rounded-xl overflow-hidden">
          <img
            src={post.image}
            alt="post"
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-5 pt-2 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition
            ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
        >
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 text-sm transition
            ${showComments ? 'text-blue-500' : 'text-gray-400 hover:text-blue-400'}`}
        >
          💬 {post.comments?.length || 0}
        </button>
      </div>

      {/* Comments */}
      {showComments && <CommentSection postId={post._id} />}
    </div>
  )
}

export default PostCard
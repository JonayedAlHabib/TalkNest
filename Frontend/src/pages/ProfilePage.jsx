import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axios'
import useAuthStore from '../store/authStore'
import PostCard from '../components/feed/PostCard'

function ProfilePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { authUser } = useAuthStore()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [followLoading, setFollowLoading] = useState(false)
  const [followStatus, setFollowStatus] = useState(null)

  const isOwnProfile = authUser?.username === username

  useEffect(() => {
    fetchProfile()
    fetchUserPosts()
  }, [username])

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get(`/users/${username}`)
      setProfile(res.data)
      const isFollowing = res.data.followers?.includes(authUser?._id)
      setFollowStatus(isFollowing ? 'following' : null)
    } catch (error) {
      console.error('Profile error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPosts = async () => {
    try {
      const profileRes = await axiosInstance.get(`/users/${username}`)
      const res = await axiosInstance.get(`/posts/user/${profileRes.data._id}`)
      setPosts(res.data)
    } catch (error) {
      console.error('Posts error:', error.message)
    }
  }

  const handleFollow = async () => {
    setFollowLoading(true)
    try {
      if (followStatus === 'following') {
        await axiosInstance.delete(`/follow/unfollow/${profile._id}`)
        setFollowStatus(null)
        setProfile(prev => ({
          ...prev,
          followers: prev.followers.filter(id => id !== authUser._id)
        }))
      } else if (followStatus === null) {
        await axiosInstance.post(`/follow/send/${profile._id}`)
        setFollowStatus('pending')
      }
    } catch (error) {
      console.error('Follow error:', error.message)
    } finally {
      setFollowLoading(false)
    }
  }

  const handleMessage = async () => {
    try {
      await axiosInstance.post('/messages/conversations', {
        recipientId: profile._id
      })
      navigate('/messages')
    } catch (error) {
      console.error('Message error:', error.message)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  if (!profile) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-400">User not found</p>
    </div>
  )

  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-24">

      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">

        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-semibold overflow-hidden">
            {profile.profilePicture
              ? <img src={profile.profilePicture} className="w-16 h-16 object-cover" alt="" />
              : profile.fullName?.charAt(0).toUpperCase()
            }
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{profile.fullName}</h2>
            <p className="text-sm text-gray-400">@{profile.username}</p>
          </div>
        </div>

        {/* Bio & Location */}
        {profile.bio && (
          <p className="text-sm text-gray-600 mb-1">{profile.bio}</p>
        )}
        {profile.location && (
          <p className="text-xs text-gray-400 mb-3">📍 {profile.location}</p>
        )}

        {/* Stats */}
        <div className="flex gap-6 mb-4">
          <div className="text-center">
            <p className="text-base font-semibold text-gray-900">{posts.length}</p>
            <p className="text-xs text-gray-400">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-gray-900">
              {profile.followers?.length || 0}
            </p>
            <p className="text-xs text-gray-400">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-gray-900">
              {profile.following?.length || 0}
            </p>
            <p className="text-xs text-gray-400">Following</p>
          </div>
        </div>

        {/* Buttons */}
        {isOwnProfile ? (
          <button className="w-full border border-gray-300 text-gray-700 text-sm py-2 rounded-full hover:bg-gray-50 transition">
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            {/* Follow Button */}
            <button
              onClick={handleFollow}
              disabled={followLoading || followStatus === 'pending'}
              className={`flex-1 text-sm py-2 rounded-full transition
                ${followStatus === 'following'
                  ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  : followStatus === 'pending'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {followLoading ? '...'
                : followStatus === 'following' ? 'Following'
                : followStatus === 'pending' ? 'Requested'
                : 'Follow'
              }
            </button>

            {/* Message Button */}
            <button
              onClick={handleMessage}
              className="flex-1 border border-gray-300 text-gray-700 text-sm py-2 rounded-full hover:bg-gray-50 transition"
            >
              Message
            </button>
          </div>
        )}
      </div>

      {/* Posts */}
      <h3 className="text-sm font-medium text-gray-500 mb-3">Posts</h3>
      {posts.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm">No posts yet</p>
      ) : (
        posts.map(post => (
          <PostCard key={post._id} post={post} onUpdate={fetchUserPosts} />
        ))
      )}
    </div>
  )
}

export default ProfilePage
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axios'
import useAuthStore from '../store/authStore'
import PostCard from '../components/feed/PostCard'
import EditProfileModal from '../components/profile/EditProfileModal'

function ProfilePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { authUser } = useAuthStore()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [followLoading, setFollowLoading] = useState(false)
  const [followStatus, setFollowStatus] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const isOwnProfile = authUser?.username === username

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get(`/users/${username}`)
      setProfile(res.data)
      const isFollowing = res.data.followers?.includes(authUser?._id)
      setFollowStatus(isFollowing ? 'following' : null)
      fetchUserPosts(res.data._id)
    } catch (error) {
      console.error('Profile error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPosts = async (userId) => {
    try {
      const res = await axiosInstance.get(`/posts/user/${userId}`)
      setPosts(res.data)
    } catch (error) {
      console.error('Posts error:', error.message)
    }
  }

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId))
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
      <p className="text-ink-dim">Loading...</p>
    </div>
  )

  if (!profile) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-ink-dim">User not found</p>
    </div>
  )

  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-24">

      {/* Profile Header */}
      <div className="bg-paper-raised border border-line rounded-2xl p-5 mb-4">

        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 text-2xl font-semibold overflow-hidden">
            {profile.profilePicture
              ? <img src={profile.profilePicture} className="w-16 h-16 object-cover" alt="" />
              : profile.fullName?.charAt(0).toUpperCase()
            }
          </div>
          <div>
            <h2 className="font-display text-lg text-ink">{profile.fullName}</h2>
            <p className="text-sm text-ink-dim">@{profile.username}</p>
          </div>
        </div>

        {/* Bio & Location */}
        {profile.bio && (
          <p className="text-sm text-ink-dim mb-1">{profile.bio}</p>
        )}
        {profile.location && (
          <p className="text-xs text-ink-dim mb-3">📍 {profile.location}</p>
        )}

        {/* Stats */}
        <div className="flex gap-6 mb-4">
          <div className="text-center">
            <p className="text-base font-semibold text-ink">{posts.length}</p>
            <p className="text-xs text-ink-dim">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-ink">
              {profile.followers?.length || 0}
            </p>
            <p className="text-xs text-ink-dim">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-ink">
              {profile.following?.length || 0}
            </p>
            <p className="text-xs text-ink-dim">Following</p>
          </div>
        </div>

        {/* Buttons */}
        {isOwnProfile ? (
          <>
            <button
              onClick={() => setShowEditModal(true)}
              className="w-full border border-line-strong text-ink text-sm py-2 rounded-full hover:bg-paper-inset transition"
            >
              Edit Profile
            </button>

            {showEditModal && (
              <EditProfileModal
                profile={profile}
                onClose={() => setShowEditModal(false)}
                onUpdate={fetchProfile}
              />
            )}
          </>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleFollow}
              disabled={followLoading || followStatus === 'pending'}
              className={`flex-1 text-sm py-2 rounded-full transition
                ${followStatus === 'following'
                  ? 'border border-line-strong text-ink hover:bg-paper-inset'
                  : followStatus === 'pending'
                    ? 'bg-accent-200 text-ink cursor-not-allowed'
                    : 'bg-accent-600 text-accent-ink hover:bg-accent-700'
                }`}
            >
              {followLoading ? '...'
                : followStatus === 'following' ? 'Following'
                : followStatus === 'pending' ? 'Requested'
                : 'Follow'
              }
            </button>

            <button
              onClick={handleMessage}
              className="flex-1 border border-line-strong text-ink text-sm py-2 rounded-full hover:bg-paper-inset transition"
            >
              Message
            </button>
          </div>
        )}
      </div>

      {/* Posts */}
      <h3 className="text-sm font-medium text-ink-dim mb-3">Posts</h3>
      {posts.length === 0 ? (
        <p className="text-center text-ink-dim py-8 text-sm">No posts yet</p>
      ) : (
        posts.map(post => (
          <PostCard key={post._id} post={post} onDelete={handlePostDeleted} />
        ))
      )}
    </div>
  )
}

export default ProfilePage
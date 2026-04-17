import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axios'
import PostCard from '../components/feed/PostCard'
import CreatePost from '../components/feed/CreatePost'

function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFeed = async () => {
    try {
      const res = await axiosInstance.get('/posts/feed')
      setPosts(res.data)
    } catch (error) {
      console.error('Feed error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-20 md:pb-4 md:pt-16">

      {/* Create Post */}
      <CreatePost onPostCreated={fetchFeed} />

      {/* Feed */}
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading feed...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          <p className="text-lg mb-2">No posts yet</p>
          <p className="text-sm">Follow some people to see their posts here</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onUpdate={fetchFeed}
          />
        ))
      )}
    </div>
  )
}

export default HomePage
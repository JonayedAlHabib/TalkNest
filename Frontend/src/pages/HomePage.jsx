import { useEffect, useState, useCallback } from 'react'
import axiosInstance from '../utils/axios'
import PostCard from '../components/feed/PostCard'
import CreatePost from '../components/feed/CreatePost'

function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const fetchFeed = useCallback(async (pageToLoad = 1) => {
    pageToLoad === 1 ? setLoading(true) : setLoadingMore(true)
    try {
      const res = await axiosInstance.get('/posts/feed', {
        params: { page: pageToLoad }
      })
      const { posts: newPosts, pages } = res.data
      setPosts(prev => (pageToLoad === 1 ? newPosts : [...prev, ...newPosts]))
      setPage(pageToLoad)
      setHasMore(pageToLoad < pages)
    } catch (error) {
      console.error('Feed error:', error.message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchFeed(1)
  }, [fetchFeed])

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev])
  }

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId))
  }

  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-20 md:pb-4 md:pt-16">

      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Feed */}
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading feed...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          <p className="text-lg mb-2">No posts yet</p>
          <p className="text-sm">Follow some people to see their posts here</p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handlePostDeleted}
            />
          ))}

          {hasMore && (
            <div className="text-center py-4">
              <button
                onClick={() => fetchFeed(page + 1)}
                disabled={loadingMore}
                className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-40"
              >
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HomePage

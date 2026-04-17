import { useState, useRef } from 'react'
import useAuthStore from '../../store/authStore'
import axiosInstance from '../../utils/axios'

function CreatePost({ onPostCreated }) {
  const { authUser } = useAuthStore()
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Max 5MB check
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result)        // base64 → Cloudinary তে যাবে
      setImagePreview(reader.result) // preview দেখাবে
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    if (!content.trim() && !image) return
    setLoading(true)
    try {
      await axiosInstance.post('/posts', {
        content,
        image: image || ''
      })
      setContent('')
      setImage(null)
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      onPostCreated()
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Post failed'
      console.error('Post error:', errorMsg)
      console.error('Full error:', error)
      alert(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = loading || (!content.trim() && !image)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4">
      <div className="flex gap-3">

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0 overflow-hidden">
          {authUser?.profilePicture
            ? <img src={authUser.profilePicture} className="w-10 h-10 object-cover" alt="" />
            : authUser?.fullName?.charAt(0).toUpperCase()
          }
        </div>

        {/* Input area */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={imagePreview ? 2 : 3}
            className="w-full resize-none border-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mt-2 mb-2">
              <img
                src={imagePreview}
                alt="preview"
                className="w-full max-h-64 object-cover rounded-xl"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-opacity-80 transition"
              >
                ×
              </button>
            </div>
          )}

          {/* Bottom bar */}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">

            {/* Image upload button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition text-sm"
              >
                <span className="text-lg">🖼️</span>
                <span className="text-xs">Photo</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Right side — char count + post button */}
            <div className="flex items-center gap-3">
              {content.length > 0 && (
                <span className={`text-xs ${content.length > 450 ? 'text-red-500' : 'text-gray-300'}`}>
                  {content.length}/500
                </span>
              )}
              <button
                onClick={handleSubmit}
                disabled={isDisabled}
                className="bg-blue-600 text-white text-sm px-5 py-1.5 rounded-full hover:bg-blue-700 transition disabled:opacity-40 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Posting...
                  </>
                ) : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
import { useState, useRef } from 'react'
import useAuthStore from '../../store/authStore'
import axiosInstance from '../../utils/axios'
import { uploadToCloudinary } from '../../utils/uploadImage'

function CreatePost({ onPostCreated }) {
  const { authUser } = useAuthStore()
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
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

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    if (!content.trim() && !imageFile) return
    setLoading(true)
    try {
      let imageUrl = ''
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile, 'posts')
      }

      const res = await axiosInstance.post('/posts', {
        content,
        image: imageUrl
      })

      setContent('')
      setImageFile(null)
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      onPostCreated(res.data.post)
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Post failed'
      console.error('Post error:', errorMsg)
      alert(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = loading || (!content.trim() && !imageFile)

  return (
    <div className="bg-paper-raised border border-line rounded-2xl p-4 mb-4">
      <div className="flex gap-3">

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-semibold text-sm flex-shrink-0 overflow-hidden">
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
            className="w-full resize-none border-none outline-none text-sm text-ink placeholder-ink-dim bg-transparent"
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
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-line">

            {/* Image upload button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-ink-dim hover:text-accent-600 transition text-sm"
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
                <span className={`text-xs ${content.length > 450 ? 'text-red-500' : 'text-ink-faint'}`}>
                  {content.length}/500
                </span>
              )}
              <button
                onClick={handleSubmit}
                disabled={isDisabled}
                className="bg-accent-600 text-accent-ink text-sm px-5 py-1.5 rounded-full hover:bg-accent-700 transition disabled:opacity-40 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-accent-ink border-t-transparent rounded-full animate-spin" />
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

import { useState } from 'react'
import axiosInstance from '../../utils/axios'
import useAuthStore from '../../store/authStore'

function EditProfileModal({ profile, onClose, onUpdate }) {
  const { setAuthUser } = useAuthStore()
  const [formData, setFormData] = useState({
    fullName: profile.fullName || '',
    bio: profile.bio || '',
    location: profile.location || '',
  })
  const [profilePicture, setProfilePicture] = useState(null)
  const [preview, setPreview] = useState(profile.profilePicture || '')
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // File size check — max 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setImageLoading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfilePicture(reader.result)  // base64 string
      setPreview(reader.result)
      setImageLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.put('/users/update/profile', {
        ...formData,
        profilePicture: profilePicture || profile.profilePicture
      })
      setAuthUser(res.data)
      onUpdate()
      onClose()
    } catch (error) {
      console.error('Update error:', error.message)
      alert('Update failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-semibold text-gray-900">Edit Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-5">
          <label className="cursor-pointer relative group">

            {/* Avatar Preview */}
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-semibold overflow-hidden">
              {imageLoading ? (
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : preview ? (
                <img
                  src={preview}
                  className="w-24 h-24 object-cover"
                  alt="profile"
                />
              ) : (
                formData.fullName?.charAt(0).toUpperCase()
              )}
            </div>

            {/* Camera overlay */}
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-2xl">📷</span>
            </div>

            {/* Edit badge */}
            <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm border-2 border-white">
              ✎
            </div>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-400 mt-2">Tap to change photo</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Write something about yourself..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition resize-none"
            />
            <p className="text-xs text-gray-300 text-right mt-0.5">
              {formData.bio.length}/150
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Location
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Dhaka, Bangladesh"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-700 text-sm py-2.5 rounded-full hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || imageLoading}
            className="flex-1 bg-blue-600 text-white text-sm py-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfileModal
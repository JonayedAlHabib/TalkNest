import axiosInstance from './axios'

// Uploads a file straight to Cloudinary using a short-lived signature from
// our API, so image bytes never round-trip through our own server as base64.
export async function uploadToCloudinary(file, folder) {
  const { data } = await axiosInstance.get('/uploads/signature', {
    params: { folder }
  })

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', data.apiKey)
  formData.append('timestamp', data.timestamp)
  formData.append('signature', data.signature)
  formData.append('folder', data.folder)

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!uploadRes.ok) {
    throw new Error('Image upload failed')
  }

  const uploaded = await uploadRes.json()
  return uploaded.secure_url
}

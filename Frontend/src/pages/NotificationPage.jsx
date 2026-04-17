import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axios'

function NotificationPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get('/follow/pending')
      setRequests(res.data)
    } catch (error) {
      console.error('Notifications error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async (requestId, action) => {
    try {
      await axiosInstance.put(`/follow/respond/${requestId}`, { action })
      setRequests(prev => prev.filter(r => r._id !== requestId))
    } catch (error) {
      console.error('Respond error:', error.message)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-24">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Notifications</h2>

      {loading && <p className="text-center text-gray-400 text-sm py-8">Loading...</p>}

      {!loading && requests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No new notifications</p>
        </div>
      )}

      {requests.length > 0 && (
        <>
          <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
            Follow Requests ({requests.length})
          </p>
          {requests.map((req) => (
            <div key={req._id} className="bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-2 flex items-center gap-3">

              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold flex-shrink-0">
                {req.sender?.profilePicture
                  ? <img src={req.sender.profilePicture} className="w-11 h-11 rounded-full object-cover" alt="" />
                  : req.sender?.fullName?.charAt(0).toUpperCase()
                }
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{req.sender?.fullName}</p>
                <p className="text-xs text-gray-400">@{req.sender?.username} wants to follow you</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleRespond(req._id, 'accept')}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRespond(req._id, 'decline')}
                  className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-50 transition"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default NotificationPage
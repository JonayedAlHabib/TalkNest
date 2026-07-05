import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import useAuthStore from '../store/authStore'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const useSocket = () => {
  const { authUser } = useAuthStore()
  const socketRef = useRef(null)

  useEffect(() => {
    if (!authUser) return

    socketRef.current = io(SOCKET_URL, {
      query: { userId: authUser._id }
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [authUser])

  return socketRef.current
}

export default useSocket
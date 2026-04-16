import { create } from 'zustand'
import axiosInstance from '../utils/axios'

const useAuthStore = create((set) => ({
  authUser: null,
  isLoading: true,

  setAuthUser: (user) => set({ authUser: user }),

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout')
      set({ authUser: null })
      console.log('✅ Logged out successfully')
    } catch (error) {
      console.error('❌ Logout error:', error.message)
      set({ authUser: null })
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/me')
      set({ authUser: res.data, isLoading: false })
      console.log('✅ Auth check passed, user:', res.data)
    } catch (error) {
      console.error('❌ Auth check failed:', error.response?.data?.message || error.message)
      set({ authUser: null, isLoading: false })
    }
  }
}))

export default useAuthStore
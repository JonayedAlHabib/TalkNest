import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import axiosInstance from '../utils/axios'
import useAuthStore from '../store/authStore'

function ChatPage() {
  const { authUser } = useAuthStore()
  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [onlineUsers, setOnlineUsers] = useState([])
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Socket.io connect
  useEffect(() => {
    if (!authUser) return

    socketRef.current = io('http://localhost:5000', {
      query: { userId: authUser._id }
    })

    // Online users list
    socketRef.current.on('getOnlineUsers', (users) => {
      setOnlineUsers(users)
    })

    // নতুন message আসলে
    socketRef.current.on('newMessage', (message) => {
      setMessages(prev => [...prev, message])
      fetchConversations()
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [authUser])

  // Message আসলে নিচে scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv._id)
    }
  }, [selectedConv])

  const fetchConversations = async () => {
    try {
      const res = await axiosInstance.get('/messages/conversations')
      setConversations(res.data)
    } catch (error) {
      console.error('Conversations error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    try {
      const res = await axiosInstance.get(`/messages/${conversationId}`)
      setMessages(res.data)
    } catch (error) {
      console.error('Messages error:', error.message)
    }
  }

  const sendMessage = async () => {
    if (!text.trim() || !selectedConv) return

    const receiver = selectedConv.members?.find(
      m => m._id !== authUser._id
    )

    try {
      const res = await axiosInstance.post('/messages', {
        conversationId: selectedConv._id,
        receiverId: receiver._id,
        text
      })
      setMessages(prev => [...prev, res.data.data])
      setText('')
      fetchConversations()
    } catch (error) {
      console.error('Send error:', error.message)
    }
  }

  const getOtherUser = (conv) => {
    return conv.members?.find(m => m._id !== authUser._id)
  }

  const isOnline = (userId) => {
    return onlineUsers.includes(userId)
  }

  const formatTime = (date) => {
    if (!date) return ''
    const diff = Date.now() - new Date(date)
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h`
    return `${Math.floor(hrs / 24)}d`
  }

  const isSentByMe = (msg) => {
    return msg.sender === authUser._id || msg.sender?._id === authUser._id
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 md:pb-4 md:pt-0">
      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>

        {/* Left — Conversation List */}
        <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col bg-white
          ${selectedConv ? 'hidden md:flex' : 'flex'}`}>

          <div className="p-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Messages</h2>
          </div>

          {loading && (
            <p className="text-center text-gray-400 text-sm p-4">Loading...</p>
          )}

          {!loading && conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
              <p className="text-gray-400 text-sm">No conversations yet</p>
              <p className="text-gray-300 text-xs mt-1">
                Go to a profile and click Message
              </p>
            </div>
          )}

          <div className="overflow-y-auto flex-1">
            {conversations.map(conv => {
              const other = getOtherUser(conv)
              const online = isOnline(other?._id)
              return (
                <div
                  key={conv._id}
                  onClick={() => setSelectedConv(conv)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer
                    hover:bg-gray-50 transition border-b border-gray-50
                    ${selectedConv?._id === conv._id ? 'bg-blue-50' : ''}`}
                >
                  {/* Avatar with online dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold overflow-hidden">
                      {other?.profilePicture
                        ? <img src={other.profilePicture} className="w-11 h-11 object-cover" alt="" />
                        : other?.fullName?.charAt(0).toUpperCase()
                      }
                    </div>
                    {online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {other?.fullName}
                      </p>
                      <span className="text-xs text-gray-300 flex-shrink-0 ml-1">
                        {conv.lastMessage ? formatTime(conv.updatedAt) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {conv.lastMessage?.text || 'Say hello!'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right — Chat Window */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col bg-white">

            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <button
                onClick={() => setSelectedConv(null)}
                className="md:hidden text-gray-400 hover:text-gray-600 mr-1 text-lg"
              >
                ←
              </button>

              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm overflow-hidden">
                  {getOtherUser(selectedConv)?.profilePicture
                    ? <img src={getOtherUser(selectedConv).profilePicture} className="w-9 h-9 object-cover" alt="" />
                    : getOtherUser(selectedConv)?.fullName?.charAt(0).toUpperCase()
                  }
                </div>
                {isOnline(getOtherUser(selectedConv)?._id) && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">
                  {getOtherUser(selectedConv)?.fullName}
                </p>
                <p className="text-xs">
                  {isOnline(getOtherUser(selectedConv)?._id)
                    ? <span className="text-green-500">Online</span>
                    : <span className="text-gray-400">Offline</span>
                  }
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-gray-50">
              {messages.length === 0 && (
                <p className="text-center text-gray-400 text-sm mt-8">
                  Say hello to {getOtherUser(selectedConv)?.fullName}! 👋
                </p>
              )}
              {messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`flex ${isSentByMe(msg) ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl text-sm
                    ${isSentByMe(msg)
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1
                      ${isSentByMe(msg) ? 'text-blue-200' : 'text-gray-400'}`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {/* Auto scroll এর জন্য */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={sendMessage}
                disabled={!text.trim()}
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white disabled:opacity-40 hover:bg-blue-700 transition flex-shrink-0"
              >
                ➤
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Select a conversation</p>
              <p className="text-gray-300 text-xs mt-1">or go to a profile to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
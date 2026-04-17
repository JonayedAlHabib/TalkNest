import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axios'
import useAuthStore from '../store/authStore'

function ChatPage() {
  const { authUser } = useAuthStore()
  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

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
    const receiver = selectedConv.members?.find(m => m._id !== authUser._id)
    try {
      const res = await axiosInstance.post('/messages', {
        conversationId: selectedConv._id,
        receiverId: receiver._id,
        text
      })
      setMessages(prev => [...prev, res.data.data])
      setText('')
    } catch (error) {
      console.error('Send error:', error.message)
    }
  }

  const getOtherUser = (conv) => {
    return conv.members?.find(m => m._id !== authUser._id)
  }

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date)
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m`
    return `${Math.floor(mins / 60)}h`
  }

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-4">
      <div className="flex h-screen md:h-[calc(100vh-60px)]">

        {/* Left — Conversation List */}
        <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Messages</h2>
          </div>

          {loading && <p className="text-center text-gray-400 text-sm p-4">Loading...</p>}

          {!loading && conversations.length === 0 && (
            <p className="text-center text-gray-400 text-sm p-8">No conversations yet</p>
          )}

          <div className="overflow-y-auto flex-1">
            {conversations.map(conv => {
              const other = getOtherUser(conv)
              return (
                <div
                  key={conv._id}
                  onClick={() => setSelectedConv(conv)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition border-b border-gray-50
                    ${selectedConv?._id === conv._id ? 'bg-blue-50' : ''}`}
                >
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold flex-shrink-0">
                    {other?.profilePicture
                      ? <img src={other.profilePicture} className="w-11 h-11 rounded-full object-cover" alt="" />
                      : other?.fullName?.charAt(0).toUpperCase()
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{other?.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {conv.lastMessage?.text || 'Say hello!'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-300">
                    {conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : ''}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right — Chat Window */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col">

            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white">
              <button
                onClick={() => setSelectedConv(null)}
                className="md:hidden text-gray-400 mr-1"
              >
                ←
              </button>
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                {getOtherUser(selectedConv)?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {getOtherUser(selectedConv)?.fullName}
                </p>
                <p className="text-xs text-gray-400">
                  @{getOtherUser(selectedConv)?.username}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {messages.length === 0 && (
                <p className="text-center text-gray-400 text-sm mt-8">
                  Say hello to {getOtherUser(selectedConv)?.fullName}!
                </p>
              )}
              {messages.map(msg => (
                <div
                  key={msg._id}
                  className={`flex ${msg.sender === authUser._id || msg.sender?._id === authUser._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm
                    ${msg.sender === authUser._id || msg.sender?._id === authUser._id
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none text-gray-800"
              />
              <button
                onClick={sendMessage}
                disabled={!text.trim()}
                className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition"
              >
                ➤
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-gray-400 text-sm">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
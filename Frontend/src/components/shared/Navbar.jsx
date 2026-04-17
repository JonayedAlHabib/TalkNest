import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { authUser, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const links = [
    { path: '/',                              label: 'Home',    icon: '⌂' },
    { path: '/search',                        label: 'Search',  icon: '⌕' },
    { path: '/notifications',                 label: 'Alerts',  icon: '🔔' },
    { path: '/messages',                      label: 'Chat',    icon: '💬' },
    { path: `/profile/${authUser?.username}`, label: 'Profile', icon: '👤' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-2xl mx-auto px-4 py-2 flex justify-around items-center">

        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors
              ${location.pathname === link.path
                ? 'text-blue-600'
                : 'text-gray-400 hover:text-gray-700'
              }`}
          >
            <span className="text-xl leading-none">{link.icon}</span>
            <span className="text-xs">{link.label}</span>
          </Link>
        ))}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-red-400 hover:text-red-600 transition-colors"
        >
          <span className="text-xl leading-none">⏻</span>
          <span className="text-xs">Logout</span>
        </button>

      </div>
    </nav>
  )
}

export default Navbar
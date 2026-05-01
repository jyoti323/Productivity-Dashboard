import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../redux/authSlice'
import { toggleDarkMode } from '../redux/settingsSlice'
import styles from './Navbar.module.css'

// Map route paths to readable page titles
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tasks':     'My Tasks',
  '/settings':  'Settings',
}

function Navbar({ collapsed }) {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user }  = useSelector((state) => state.auth)
  const { darkMode } = useSelector((state) => state.settings)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return ' Good morning'
    if (hour < 17) return ' Good afternoon'
    return ' Good evening'
  }

  const currentPage = pageTitles[location.pathname] || 'Dashboard'

  return (
    <nav className={`${styles.navbar} ${collapsed ? styles.mini : ''}`}>
      {/* Left: Greeting + Page Title */}
      <div className={styles.left}>
        <span className={styles.greeting}>
          {getGreeting()}, {user?.name || 'User'}!
        </span>
        <span className={styles.pageTitle}>{currentPage}</span>
      </div>

      {/* Right: Controls */}
      <div className={styles.right}>
        {/* Dark Mode */}
        <button
          className={styles.darkBtn}
          onClick={() => dispatch(toggleDarkMode())}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        <div className={styles.divider} />

        {/* User Chip */}
        <div className={styles.userChip}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className={styles.userName}>{user?.name || 'User'}</span>
        </div>

        {/* Logout */}
        <button className={styles.logoutBtn} onClick={handleLogout}>
           Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
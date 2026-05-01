import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '' },
  { path: '/tasks',     label: 'Tasks',     icon: '' },
  { path: '/settings',  label: 'Settings',  icon: '' },
]

// Sidebar tells App its collapsed state via onToggle
function Sidebar({ onToggle }) {
  const [collapsed, setCollapsed] = useState(false)

  const handleToggle = () => {
    const next = !collapsed
    setCollapsed(next)
    if (onToggle) onToggle(next) // notify App.jsx
  }

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.brandIcon}></div>
        {!collapsed && (
          <div className={styles.brandText}>
            <span className={styles.brandName}>FocusFlow</span>
            <span className={styles.brandSub}>Productivity Dashboard</span>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className={styles.nav}>
        {!collapsed && (
          <span className={styles.navLabel}>Main Menu</span>
        )}

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : ''}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.linkIcon}>{item.icon}</span>
            {!collapsed && (
              <>
                <span className={styles.linkLabel}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Toggle Button at bottom */}
      <div className={styles.footer}>
        <button className={styles.toggleBtn} onClick={handleToggle}>
          <span className={styles.toggleIcon}>◀</span>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
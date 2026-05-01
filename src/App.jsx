import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

function App() {
  const { isLoggedIn } = useSelector((state) => state.auth)
  const { darkMode }   = useSelector((state) => state.settings)

  // Track sidebar collapsed state here so Navbar can sync its left position
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <Router basename="/Productivity-Dashboard">
      <div className={`app-wrapper ${darkMode ? 'dark' : ''}`}>

        {isLoggedIn && (
          <Sidebar onToggle={(val) => setSidebarCollapsed(val)} />
        )}

        <div className={`main-content ${isLoggedIn ? '' : ''} ${sidebarCollapsed ? 'sidebar-mini' : ''}`}>
          {isLoggedIn && <Navbar collapsed={sidebarCollapsed} />}

          <Routes>
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks"     element={<Tasks />} />
              <Route path="/settings"  element={<Settings />} />
            </Route>
            <Route
              path="*"
              element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} />}
            />
          </Routes>
        </div>

      </div>
    </Router>
  )
}

export default App
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

// If not logged in → redirect to login
// If logged in → render the child page (Outlet)

function ProtectedRoute() {
  const { isLoggedIn } = useSelector((state) => state.auth)

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute
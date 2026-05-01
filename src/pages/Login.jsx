import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../redux/authSlice'
import styles from './Login.module.css'

// Mock credentials
const MOCK_EMAIL    = 'student@focusflow.com'
const MOCK_PASSWORD = '123456'

function Login() {
  const dispatch = useDispatch()

  const [form, setForm]     = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim())
      newErrors.name = ' Name is required'
    if (!form.email.trim())
      newErrors.email = ' Email is required'
    else if (form.email !== MOCK_EMAIL)
      newErrors.email = ' Use: student@focusflow.com'
    if (!form.password)
      newErrors.password = ' Password is required'
    else if (form.password !== MOCK_PASSWORD)
      newErrors.password = ' Use: 123456'
    return newErrors
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Clear error on type
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setLoading(true)
    // Simulate API delay
    setTimeout(() => {
      dispatch(login({ name: form.name, email: form.email }))
      setLoading(false)
    }, 800)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}></div>
          <h1>FocusFlow</h1>
          <p>AI-Powered Productivity Dashboard</p>
        </div>

        <div className={styles.divider}>
          <span>Sign in to continue</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Your Name</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}></span>
              <input
                className={`${styles.input} ${errors.name ? styles.error : ''}`}
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && (
              <p className={styles.errorText}>{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}></span>
              <input
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                type="text"
                name="email"
                placeholder="student@focusflow.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <p className={styles.errorText}>{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}></span>
              <input
                className={`${styles.input} ${errors.password ? styles.error : ''}`}
                type="password"
                name="password"
                placeholder="••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && (
              <p className={styles.errorText}>{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? ' Signing in...' : ' Sign In'}
          </button>
        </form>

        {/* Hint */}
        <div className={styles.hint}>
          <p> student@focusflow.com</p>
          <p> Password: 123456</p>
        </div>
      </div>
    </div>
  )
}

export default Login
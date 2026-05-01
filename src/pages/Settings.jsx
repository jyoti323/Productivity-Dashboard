import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleDarkMode, updateUserName } from '../redux/settingsSlice'
import { login } from '../redux/authSlice'
import styles from './Settings.module.css'

// ── Step definitions for multi-step form ──
const STEPS = [
  { id: 1, label: 'Profile',      icon: '' },
  { id: 2, label: 'Preferences',  icon: '' },
  { id: 3, label: 'Review',       icon: '' },
]

function Settings() {
  const dispatch  = useDispatch()
  const { darkMode } = useSelector((state) => state.settings)
  const { user }     = useSelector((state) => state.auth)

  // ── Multi-step form state ──
  const [currentStep, setCurrentStep] = useState(1)
  const [saved, setSaved]             = useState(false)

  // Step 1 — Profile fields
  const [profileForm, setProfileForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    role:  'Student',
  })
  const [profileErrors, setProfileErrors] = useState({})

  // Step 2 — Preferences
  const [prefForm, setPrefForm] = useState({
    theme:        darkMode ? 'dark' : 'light',
    pomoDuration: '25',
    notifications: true,
  })

  // ── Appearance toggles (separate from multi-step) ──
  const [compactMode,   setCompactMode]   = useState(false)
  const [soundEnabled,  setSoundEnabled]  = useState(true)

  // ── Step 1 Validation ──
  const validateProfile = () => {
    const errs = {}
    if (!profileForm.name.trim())
      errs.name  = 'Name is required'
    if (!profileForm.email.trim())
      errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(profileForm.email))
      errs.email = 'Enter a valid email'
    return errs
  }

  const handleNext = () => {
    if (currentStep === 1) {
      const errs = validateProfile()
      if (Object.keys(errs).length > 0) {
        setProfileErrors(errs)
        return
      }
      setProfileErrors({})
    }
    setCurrentStep((s) => Math.min(s + 1, STEPS.length))
  }

  const handlePrev = () => {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }

  // ── Final Submit ──
  const handleSubmit = () => {
    // Update Redux auth user name
    dispatch(login({
      name:  profileForm.name,
      email: profileForm.email,
    }))
    // Update settings username
    dispatch(updateUserName(profileForm.name))

    // Apply theme preference
    if (prefForm.theme === 'dark' && !darkMode) dispatch(toggleDarkMode())
    if (prefForm.theme === 'light' && darkMode)  dispatch(toggleDarkMode())

    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setCurrentStep(1)
    }, 2500)
  }

  // ── Step Indicator Component ──
  const StepIndicators = () => (
    <div className={styles.stepIndicators}>
      {STEPS.map((step, idx) => (
        <div key={step.id} className={styles.stepItem}>
          {/* Circle */}
          <div
            className={`${styles.stepCircle}
              ${currentStep === step.id ? styles.active : ''}
              ${currentStep > step.id  ? styles.done   : ''}
            `}
          >
            {currentStep > step.id ? '✓' : step.icon}
            <span className={styles.stepName}>{step.label}</span>
          </div>

          {/* Line between steps */}
          {idx < STEPS.length - 1 && (
            <div
              className={`${styles.stepLine}
                ${currentStep > step.id ? styles.done : ''}
              `}
            />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1> Settings</h1>
        <p>Manage your profile, preferences, and app settings</p>
      </div>

      <div className={styles.grid}>

        {/* ── LEFT COL ── */}

        {/* Multi-Step Form */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>🪄</div>
            <div>
              <h3>Profile Setup Wizard</h3>
              <p>Update your profile in 3 simple steps</p>
            </div>
          </div>

          {/* Step Indicators */}
          <div style={{ marginBottom: 40 }}>
            <StepIndicators />
          </div>

          {/* ── Step Content ── */}
          <div className={styles.stepContent}>

            {/* STEP 1 — Profile Info */}
            {currentStep === 1 && (
              <div>
                <p className={styles.stepTitle}>👤 Personal Information</p>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    className={`${styles.input}
                      ${profileErrors.name ? styles.inputError : ''}`}
                    type="text"
                    placeholder="Your full name"
                    value={profileForm.name}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, name: e.target.value })
                      if (profileErrors.name)
                        setProfileErrors({ ...profileErrors, name: '' })
                    }}
                  />
                  {profileErrors.name && (
                    <span className={styles.errorText}>
                       {profileErrors.name}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    className={`${styles.input}
                      ${profileErrors.email ? styles.inputError : ''}`}
                    type="email"
                    placeholder="your@email.com"
                    value={profileForm.email}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, email: e.target.value })
                      if (profileErrors.email)
                        setProfileErrors({ ...profileErrors, email: '' })
                    }}
                  />
                  {profileErrors.email && (
                    <span className={styles.errorText}>
                       {profileErrors.email}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Role</label>
                  <select
                    className={styles.input}
                    value={profileForm.role}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, role: e.target.value })
                    }
                  >
                    <option value="Student">🎓 Student</option>
                    <option value="Developer">💻 Developer</option>
                    <option value="Designer">🎨 Designer</option>
                    <option value="Manager">📊 Manager</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2 — Preferences */}
            {currentStep === 2 && (
              <div>
                <p className={styles.stepTitle}>🎨 App Preferences</p>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Theme</label>
                  <select
                    className={styles.input}
                    value={prefForm.theme}
                    onChange={(e) =>
                      setPrefForm({ ...prefForm, theme: e.target.value })
                    }
                  >
                    <option value="light">☀️ Light Mode</option>
                    <option value="dark">🌙 Dark Mode</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Pomodoro Focus Duration
                  </label>
                  <select
                    className={styles.input}
                    value={prefForm.pomoDuration}
                    onChange={(e) =>
                      setPrefForm({ ...prefForm, pomoDuration: e.target.value })
                    }
                  >
                    <option value="15">15 minutes</option>
                    <option value="25">25 minutes (default)</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>

                {/* Notifications toggle */}
                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>
                       Notifications
                    </span>
                    <span className={styles.toggleDesc}>
                      Get task reminders
                    </span>
                  </div>
                  <button
                    className={`${styles.switch}
                      ${prefForm.notifications ? styles.on : ''}`}
                    onClick={() =>
                      setPrefForm({
                        ...prefForm,
                        notifications: !prefForm.notifications,
                      })
                    }
                  >
                    <div className={styles.knob} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — Review */}
            {currentStep === 3 && (
              <div>
                <p className={styles.stepTitle}> Review Your Settings</p>

                {/* Profile Preview Card */}
                <div className={styles.previewCard}>
                  <div className={styles.previewAvatar}>
                    {profileForm.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className={styles.previewInfo}>
                    <h4>{profileForm.name || 'No name'}</h4>
                    <p>{profileForm.email || 'No email'}</p>
                    <span>{profileForm.role}</span>
                  </div>
                </div>

                {/* Summary */}
                <div
                  style={{
                    marginTop: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {[
                    {
                      label: ' Theme',
                      value: prefForm.theme === 'dark'
                        ? ' Dark Mode'
                        : ' Light Mode',
                    },
                    {
                      label: ' Pomodoro',
                      value: `${prefForm.pomoDuration} minutes`,
                    },
                    {
                      label: ' Notifications',
                      value: prefForm.notifications ? 'Enabled' : 'Disabled',
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)',
                        fontWeight: 600 }}>
                        {item.label}
                      </span>
                      <span style={{ color: 'var(--text-primary)',
                        fontWeight: 700 }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step Navigation */}
          <div className={styles.stepNav}>
            <span className={styles.stepCount}>
              Step {currentStep} of {STEPS.length}
            </span>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {currentStep > 1 && (
                <button className={styles.prevBtn} onClick={handlePrev}>
                  ← Back
                </button>
              )}

              {currentStep < STEPS.length ? (
                <button className={styles.nextBtn} onClick={handleNext}>
                  Next →
                </button>
              ) : (
                <>
                  <button className={styles.nextBtn} onClick={handleSubmit}>
                     Save All Settings
                  </button>
                  {saved && (
                    <span className={styles.successMsg}>
                       Saved!
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Appearance Card ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}></div>
            <div>
              <h3>Appearance</h3>
              <p>Quick visual settings</p>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>
                {darkMode ? ' Dark Mode' : ' Light Mode'}
              </span>
              <span className={styles.toggleDesc}>
                Switch app theme instantly
              </span>
            </div>
            <button
              className={`${styles.switch} ${darkMode ? styles.on : ''}`}
              onClick={() => dispatch(toggleDarkMode())}
            >
              <div className={styles.knob} />
            </button>
          </div>

          {/* Compact Mode Toggle */}
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}> Compact Mode</span>
              <span className={styles.toggleDesc}>
                Reduce spacing for more content
              </span>
            </div>
            <button
              className={`${styles.switch} ${compactMode ? styles.on : ''}`}
              onClick={() => setCompactMode((v) => !v)}
            >
              <div className={styles.knob} />
            </button>
          </div>

          {/* Sound Toggle */}
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>🔊 Sound Effects</span>
              <span className={styles.toggleDesc}>
                Timer and notification sounds
              </span>
            </div>
            <button
              className={`${styles.switch} ${soundEnabled ? styles.on : ''}`}
              onClick={() => setSoundEnabled((v) => !v)}
            >
              <div className={styles.knob} />
            </button>
          </div>
        </div>

        {/* ── About Card ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>ℹ️</div>
            <div>
              <h3>About FocusFlow</h3>
              <p>App information</p>
            </div>
          </div>

          <div className={styles.aboutGrid}>
            {[
              { label: 'Version',     value: 'v1.0.0' },
              { label: 'Built With',  value: 'React + Vite' },
              { label: 'State Mgmt',  value: 'Redux Toolkit' },
              { label: 'Routing',     value: 'React Router v6' },
              { label: 'HTTP Client', value: 'Axios' },
              { label: 'Drag & Drop', value: '@hello-pangea/dnd' },
              { label: 'API Used',    value: 'Open-Meteo' },
              { label: 'Author',      value: user?.name || 'Student' },
            ].map((item) => (
              <div key={item.label} className={styles.aboutItem}>
                <p>{item.label}</p>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Settings
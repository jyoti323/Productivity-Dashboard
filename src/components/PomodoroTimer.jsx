import React, { useState, useEffect, useRef } from 'react'

const MODES = {
  focus:       { label: ' Focus Time',    duration: 25 * 60 },
  short_break: { label: ' Short Break',   duration: 5  * 60 },
  long_break:  { label: ' Long Break',    duration: 15 * 60 },
}

// Format seconds → MM:SS
const fmt = (s) => {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function PomodoroTimer() {
  const [mode, setMode]         = useState('focus')
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration)
  const [running, setRunning]   = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef             = useRef(null)

  const totalTime = MODES[mode].duration
  const progress  = ((totalTime - timeLeft) / totalTime) * 100

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (mode === 'focus') setSessions((s) => s + 1)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  const handleMode = (m) => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setMode(m)
    setTimeLeft(MODES[m].duration)
  }

  const handleReset = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setTimeLeft(MODES[mode].duration)
  }

  const cardStyle = {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    padding: '22px',
    boxShadow: 'var(--shadow-sm)',
  }

  const modeTabStyle = (m) => ({
    flex: 1,
    padding: '7px 4px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.75rem',
    fontWeight: 600,
    background: mode === m ? 'var(--accent)' : 'transparent',
    color: mode === m ? 'white' : 'var(--text-muted)',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--transition)',
  })

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700,
          color: 'var(--text-primary)' }}>
           Pomodoro Timer
        </h3>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)',
          background: 'var(--bg-primary)', padding: '3px 10px',
          borderRadius: 20, fontWeight: 600 }}>
          {sessions} session{sessions !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: 4,
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-sm)', padding: 4,
        marginBottom: 20 }}>
        {Object.keys(MODES).map((m) => (
          <button key={m} style={modeTabStyle(m)} onClick={() => handleMode(m)}>
            {m === 'focus' ? 'Focus' : m === 'short_break' ? 'Short' : 'Long'}
          </button>
        ))}
      </div>

      {/* Mode Label */}
      <p style={{ textAlign: 'center', fontSize: '0.82rem',
        color: 'var(--text-muted)', marginBottom: 10,
        fontWeight: 500 }}>
        {MODES[mode].label}
      </p>

      {/* Progress Bar */}
      <div style={{ height: 6, background: 'var(--bg-primary)',
        borderRadius: 10, marginBottom: 16,
        border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--accent), #818cf8)',
          borderRadius: 10,
          transition: 'width 1s linear',
        }} />
      </div>

      {/* Timer Display */}
      <div style={{
        textAlign: 'center',
        fontSize: '3.2rem',
        fontWeight: 800,
        color: running ? 'var(--accent)' : 'var(--text-primary)',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: 2,
        marginBottom: 20,
        transition: 'color 0.3s',
      }}>
        {fmt(timeLeft)}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => setRunning((r) => !r)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            background: running
              ? '#fee2e2'
              : 'linear-gradient(135deg, var(--accent), #818cf8)',
            color: running ? '#dc2626' : 'white',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'var(--transition)',
            boxShadow: running ? 'none' : '0 4px 12px rgba(99,102,241,0.3)',
          }}
        >
          {running ? '⏸ Pause' : '▶ Start'}
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-primary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'var(--transition)',
          }}
        >
          ↺ Reset
        </button>
      </div>
    </div>
  )
}

export default PomodoroTimer
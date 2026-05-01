// import React, { memo } from 'react'
// import { useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import styles from './Dashboard.module.css'
// import WeatherWidget from '../components/WeatherWidget'
// import PomodoroTimer from '../components/PomodoroTimer'
// import { formatDate, getPriorityColor, getStatusColor } from '../utils/helpers'

// // ─── Stat Card ────────────────────────────────────────────────
// // Wrapped with memo — only re-renders if props change
// const StatCard = memo(({ icon, value, label, bg, trend, trendColor }) => (
//   <div className={styles.statCard}>
//     <div className={styles.statIconWrap} style={{ background: bg }}>
//       {icon}
//     </div>
//     <div className={styles.statInfo}>
//       <div className={styles.statValue}>{value}</div>
//       <div className={styles.statLabel}>{label}</div>
//     </div>
//     {trend && (
//       <span
//         className={styles.statTrend}
//         style={{ background: trendColor + '20', color: trendColor }}
//       >
//         {trend}
//       </span>
//     )}
//   </div>
// ))

// // ─── Dashboard ────────────────────────────────────────────────
// function Dashboard() {
//   const navigate = useNavigate()
//   const tasks    = useSelector((state) => state.tasks.tasks)
//   const { user } = useSelector((state) => state.auth)

//   // Derived stats
//   const total      = tasks.length
//   const completed  = tasks.filter((t) => t.status === 'completed').length
//   const inProgress = tasks.filter((t) => t.status === 'in-progress').length
//   const pending    = tasks.filter((t) => t.status === 'pending').length
//   const pct        = total > 0 ? Math.round((completed / total) * 100) : 0

//   // Priority counts
//   const high   = tasks.filter((t) => t.priority === 'high').length
//   const medium = tasks.filter((t) => t.priority === 'medium').length
//   const low    = tasks.filter((t) => t.priority === 'low').length

//   // Recent 4 tasks
//   const recentTasks = [...tasks].slice(-4).reverse()

//   // Fake productivity heatmap data (28 days)
//   const heatmap = [
//     'active','medium','light','none','active','active','medium',
//     'light','none','medium','active','none','light','active',
//     'active','medium','active','light','none','active','medium',
//     'none','light','active','active','medium','none','light',
//   ]

//   const dayNames = ['M','T','W','T','F','S','S']

//   return (
//     <div className={styles.page}>
//       {/* Header */}
//       <div className={styles.header}>
//         <h1>Welcome back, {user?.name?.split(' ')[0]} </h1>
//         <p>Here's your productivity overview for today</p>
//       </div>

//       {/* Stats Grid */}
//       <div className={styles.statsGrid}>
//         <StatCard
//           icon="📋"
//           value={total}
//           label="Total Tasks"
//           bg="#eef2ff"
//           trend="All time"
//           trendColor="#6366f1"
//         />
//         <StatCard
//           icon="✅"
//           value={completed}
//           label="Completed"
//           bg="#dcfce7"
//           trend={`${pct}%`}
//           trendColor="#16a34a"
//         />
//         <StatCard
//           icon="⚡"
//           value={inProgress}
//           label="In Progress"
//           bg="#dbeafe"
//           trend="Active"
//           trendColor="#2563eb"
//         />
//         <StatCard
//           icon="⏳"
//           value={pending}
//           label="Pending"
//           bg="#fef3c7"
//           trend="Todo"
//           trendColor="#d97706"
//         />
//       </div>

//       {/* Main Grid */}
//       <div className={styles.grid}>

//         {/* Recent Tasks */}
//         <div className={styles.sectionCard}>
//           <div className={styles.sectionHeader}>
//             <h3>📝 Recent Tasks</h3>
//             <button
//               className={styles.viewAll}
//               onClick={() => navigate('/tasks')}
//             >
//               View All →
//             </button>
//           </div>

//           {recentTasks.length === 0 ? (
//             <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
//               No tasks yet. Add some!
//             </p>
//           ) : (
//             recentTasks.map((task) => (
//               <div key={task.id} className={styles.taskItem}>
//                 <div
//                   className={styles.taskDot}
//                   style={{ background: getStatusColor(task.status) }}
//                 />
//                 <div className={styles.taskInfo}>
//                   <div className={styles.taskName}>{task.title}</div>
//                   <div className={styles.taskMeta}>
//                     <span
//                       className="badge"
//                       style={{
//                         background: getPriorityColor(task.priority) + '20',
//                         color: getPriorityColor(task.priority),
//                       }}
//                     >
//                       {task.priority}
//                     </span>
//                     {' · '}
//                     {formatDate(task.createdAt)}
//                   </div>
//                 </div>
//                 <span className={`badge badge-${task.status}`}>
//                   {task.status}
//                 </span>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Completion Progress */}
//         <div className={styles.sectionCard}>
//           <div className={styles.sectionHeader}>
//             <h3>📊 Completion Rate</h3>
//           </div>

//           {/* Overall */}
//           <div className={styles.progressWrap}>
//             <div className={styles.progressLabel}>
//               <span>Overall Progress</span>
//               <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
//                 {pct}%
//               </span>
//             </div>
//             <div className={styles.progressBar}>
//               <div
//                 className={styles.progressFill}
//                 style={{
//                   width: `${pct}%`,
//                   background: 'linear-gradient(90deg, var(--accent), #818cf8)',
//                 }}
//               />
//             </div>
//           </div>

//           {/* Priority Breakdown */}
//           <div className={styles.sectionHeader} style={{ marginTop: 20 }}>
//             <h3>🎯 Priority Breakdown</h3>
//           </div>
//           <div className={styles.priorityList}>
//             {[
//               { label: 'high',   count: high,   color: '#ef4444' },
//               { label: 'medium', count: medium,  color: '#f59e0b' },
//               { label: 'low',    count: low,     color: '#22c55e' },
//             ].map((p) => (
//               <div key={p.label} className={styles.priorityRow}>
//                 <div
//                   className={styles.priorityDot}
//                   style={{ background: p.color }}
//                 />
//                 <span className={styles.priorityName}>{p.label}</span>
//                 <div className={styles.priorityBar}>
//                   <div
//                     className={styles.priorityFill}
//                     style={{
//                       width: total > 0 ? `${(p.count / total) * 100}%` : '0%',
//                       background: p.color,
//                     }}
//                   />
//                 </div>
//                 <span className={styles.priorityCount}>{p.count}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Weather Widget */}
//         <WeatherWidget />

//         {/* Pomodoro Timer */}
//         <PomodoroTimer />

//         {/* Productivity Heatmap — full width */}
//         <div className={`${styles.sectionCard} ${styles.gridFull}`}>
//           <div className={styles.sectionHeader}>
//             <h3>🔥 Productivity Heatmap (Last 28 Days)</h3>
//           </div>

//           {/* Day labels */}
//           <div className={styles.daysGrid} style={{ marginBottom: 6 }}>
//             {dayNames.map((d, i) => (
//               <div
//                 key={i}
//                 style={{
//                   textAlign: 'center',
//                   fontSize: '0.68rem',
//                   color: 'var(--text-muted)',
//                   fontWeight: 700,
//                 }}
//               >
//                 {d}
//               </div>
//             ))}
//           </div>

//           {/* Heatmap cells */}
//           <div className={styles.daysGrid}>
//             {heatmap.map((level, i) => (
//               <div
//                 key={i}
//                 className={`${styles.dayCell} ${
//                   level === 'active' ? styles.active  :
//                   level === 'medium' ? styles.medium  :
//                   level === 'light'  ? styles.light   : ''
//                 }`}
//                 title={`Day ${i + 1}`}
//               />
//             ))}
//           </div>

//           {/* Legend */}
//           <div className={styles.daysLegend}>
//             <div className={styles.legendItem}>
//               <div
//                 className={styles.legendDot}
//                 style={{ background: 'var(--border)' }}
//               />
//               <span>None</span>
//             </div>
//             <div className={styles.legendItem}>
//               <div
//                 className={styles.legendDot}
//                 style={{ background: 'var(--accent-light)' }}
//               />
//               <span>Low</span>
//             </div>
//             <div className={styles.legendItem}>
//               <div
//                 className={styles.legendDot}
//                 style={{ background: '#818cf8' }}
//               />
//               <span>Medium</span>
//             </div>
//             <div className={styles.legendItem}>
//               <div
//                 className={styles.legendDot}
//                 style={{ background: 'var(--accent)' }}
//               />
//               <span>High</span>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default Dashboard



import React, { memo, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from './Dashboard.module.css'
import WeatherWidget from '../components/WeatherWidget'
import PomodoroTimer from '../components/PomodoroTimer'
import { formatDate, getPriorityColor, getStatusColor } from '../utils/helpers'

// ─────────────────────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────────────────────
const StatCard = memo(({ icon, value, label, bg, trend, trendColor }) => (
  <div className={styles.statCard}>
    <div className={styles.statIconWrap} style={{ background: bg }}>
      {icon}
    </div>
    <div className={styles.statInfo}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
    {trend && (
      <span
        className={styles.statTrend}
        style={{
          background: trendColor + '18',
          color: trendColor,
        }}
      >
        {trend}
      </span>
    )}
  </div>
))

// ─────────────────────────────────────────────────────────────
// TimeWidget — live clock
// ─────────────────────────────────────────────────────────────
const TimeWidget = memo(() => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const DAYS   = ['Sunday','Monday','Tuesday','Wednesday',
                  'Thursday','Friday','Saturday']
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec']

  const h24    = now.getHours()
  const h12    = String(h24 % 12 || 12).padStart(2, '0')
  const mins   = String(now.getMinutes()).padStart(2, '0')
  const secs   = String(now.getSeconds()).padStart(2, '0')
  const ampm   = h24 >= 12 ? 'PM' : 'AM'
  const day    = DAYS[now.getDay()]
  const date   = `${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`

  return (
    <div className={styles.timeWidget}>
      <p className={styles.timeTopLabel}>🕐 Current Time</p>
      <div className={styles.timeClock}>
        {h12}:{mins}
        <span className={styles.timeSeconds}>:{secs}</span>
        <span className={styles.timeAMPM}>{ampm}</span>
      </div>
      <p className={styles.timeDate}>📅 {date}</p>
      <p className={styles.timeDayName}>{day}</p>
    </div>
  )
})

// ─────────────────────────────────────────────────────────────
// StreakWidget
// ─────────────────────────────────────────────────────────────
const StreakWidget = memo(({ completed, total }) => {
  const streak = total === 0 ? 0 : Math.min(completed * 2 + 1, 30)

  const msg =
    streak === 0  ? 'Complete tasks to start your streak!'  :
    streak < 5    ? 'Good start! Keep going 💪'             :
    streak < 15   ? "You're on a roll! Keep it up 🚀"       :
                    'Unstoppable! Legendary streak! 🏆'

  return (
    <div className={styles.streakWidget}>
      <p className={styles.streakTopLabel}>🔥 Current Streak</p>
      <div className={styles.streakRow}>
        <span className={styles.streakNumber}>{streak}</span>
        <span className={styles.streakFireIcon}>🔥</span>
      </div>
      <p className={styles.streakUnit}>days in a row</p>
      <p className={styles.streakMsg}>{msg}</p>
    </div>
  )
})

// ─────────────────────────────────────────────────────────────
// CompletionRing — SVG donut, no library
// ─────────────────────────────────────────────────────────────
const CompletionRing = memo(({ completed, inProgress, pending, total }) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  const R  = 40
  const C  = 2 * Math.PI * R   // circumference ≈ 251

  // Each segment: how much of the circle it takes
  const seg = (count) => total > 0 ? (count / total) * C : 0

  const cArc = seg(completed)
  const iArc = seg(inProgress)
  const pArc = seg(pending)

  // offset shifts where segment starts on the circle
  // SVG starts at 3 o'clock, we rotate SVG -90deg to start at top
  const cOffset = 0
  const iOffset = -cArc
  const pOffset = -(cArc + iArc)

  const segments = [
    { label: 'Completed',   arc: cArc, offset: cOffset, color: '#22c55e', val: completed  },
    { label: 'In Progress', arc: iArc, offset: iOffset, color: '#6366f1', val: inProgress },
    { label: 'Pending',     arc: pArc, offset: pOffset, color: '#f59e0b', val: pending    },
  ]

  return (
    <div className={styles.ringWidget}>

      {/* SVG Ring */}
      <div className={styles.ringWrap}>
        <svg
          className={styles.ringCircleSvg}
          viewBox="0 0 100 100"
        >
          {/* Grey background track */}
          <circle
            className={styles.ringBg}
            cx="50" cy="50" r={R}
          />

          {/* Colored segments */}
          {total === 0 ? (
            <circle
              cx="50" cy="50" r={R}
              fill="none"
              stroke="var(--border)"
              strokeWidth="10"
            />
          ) : (
            segments.map((s) =>
              s.arc > 0 ? (
                <circle
                  key={s.label}
                  className={styles.ringFill}
                  cx="50" cy="50" r={R}
                  stroke={s.color}
                  strokeDasharray={`${s.arc} ${C - s.arc}`}
                  strokeDashoffset={s.offset}
                />
              ) : null
            )
          )}
        </svg>

        {/* Center label */}
        <div className={styles.ringCenter}>
          <span className={styles.ringPct}>{pct}%</span>
          <span className={styles.ringSmall}>done</span>
        </div>
      </div>

      {/* Legend rows */}
      <div className={styles.ringInfo}>
        <p className={styles.ringInfoTitle}>📊 Task Breakdown</p>
        {segments.map((s) => (
          <div key={s.label} className={styles.ringRow}>
            <div className={styles.ringDot} style={{ background: s.color }} />
            <span className={styles.ringRowLabel}>{s.label}</span>
            <span className={styles.ringRowVal}>{s.val}</span>
          </div>
        ))}
      </div>

    </div>
  )
})

// ─────────────────────────────────────────────────────────────
// Heatmap static data
// ─────────────────────────────────────────────────────────────
const HEATMAP = [
  'active','medium','light','none',  'active','active','medium',
  'light', 'none',  'medium','active','none', 'light', 'active',
  'active','medium','active','light', 'none', 'active','medium',
  'none',  'light', 'active','active','medium','none', 'light',
]

const LEVEL = {
  active: { cls: styles.active, label: 'High activity'   },
  medium: { cls: styles.medium, label: 'Medium activity' },
  light:  { cls: styles.light,  label: 'Low activity'    },
  none:   { cls: '',            label: 'No activity'     },
}

// ─────────────────────────────────────────────────────────────
// Dashboard — main
// ─────────────────────────────────────────────────────────────
function Dashboard() {
  const navigate   = useNavigate()
  const tasks      = useSelector((s) => s.tasks.tasks)
  const { user }   = useSelector((s) => s.auth)

  const total      = tasks.length
  const completed  = tasks.filter((t) => t.status === 'completed').length
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length
  const pending    = tasks.filter((t) => t.status === 'pending').length
  const pct        = total > 0 ? Math.round((completed / total) * 100) : 0
  const high       = tasks.filter((t) => t.priority === 'high').length
  const medium     = tasks.filter((t) => t.priority === 'medium').length
  const low        = tasks.filter((t) => t.priority === 'low').length
  const recent     = [...tasks].slice(-4).reverse()

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Here's your productivity overview for today</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className={styles.statsGrid}>
        <StatCard icon="📋" value={total}
          label="Total Tasks"  bg="#eef2ff"
          trend="All time"     trendColor="#6366f1" />
        <StatCard icon="✅" value={completed}
          label="Completed"    bg="#dcfce7"
          trend={`${pct}%`}   trendColor="#16a34a" />
        <StatCard icon="⚡" value={inProgress}
          label="In Progress"  bg="#dbeafe"
          trend="Active"       trendColor="#2563eb" />
        <StatCard icon="⏳" value={pending}
          label="Pending"      bg="#fef3c7"
          trend="Todo"         trendColor="#d97706" />
      </div>

      {/* ── Main Grid ── */}
      <div className={styles.grid}>

        {/* Row 1: Time + Streak */}
        <TimeWidget />
        <StreakWidget completed={completed} total={total} />

        {/* Row 2: Completion Ring — full width */}
        <div className={styles.gridFull}>
          <CompletionRing
            completed={completed}
            inProgress={inProgress}
            pending={pending}
            total={total}
          />
        </div>

        {/* Row 3: Recent Tasks */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3>📝 Recent Tasks</h3>
            <button
              className={styles.viewAll}
              onClick={() => navigate('/tasks')}
            >
              View All →
            </button>
          </div>

          {recent.length === 0 ? (
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>
              No tasks yet — add some from Tasks page!
            </p>
          ) : (
            recent.map((task) => (
              <div key={task.id} className={styles.taskItem}>
                <div
                  className={styles.taskDot}
                  style={{ background: getStatusColor(task.status) }}
                />
                <div className={styles.taskInfo}>
                  <div className={styles.taskName}>{task.title}</div>
                  <div className={styles.taskMeta}>
                    <span
                      className="badge"
                      style={{
                        background: getPriorityColor(task.priority) + '20',
                        color: getPriorityColor(task.priority),
                      }}
                    >
                      {task.priority}
                    </span>
                    {' · '}
                    {formatDate(task.createdAt)}
                  </div>
                </div>
                <span className={`badge badge-${task.status}`}>
                  {task.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Row 3: Priority Breakdown */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3>🎯 Priority Breakdown</h3>
          </div>

          <div className={styles.progressWrap}>
            <div className={styles.progressLabel}>
              <span>Overall Completion</span>
              <span style={{ color:'var(--accent)', fontWeight:700 }}>
                {pct}%
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg,var(--accent),#818cf8)',
                }}
              />
            </div>
          </div>

          <div className={styles.priorityList}>
            {[
              { label:'High',   count: high,   color:'#ef4444' },
              { label:'Medium', count: medium,  color:'#f59e0b' },
              { label:'Low',    count: low,     color:'#22c55e' },
            ].map((p) => (
              <div key={p.label} className={styles.priorityRow}>
                <div
                  className={styles.priorityDot}
                  style={{ background: p.color }}
                />
                <span className={styles.priorityName}>{p.label}</span>
                <div className={styles.priorityBar}>
                  <div
                    className={styles.priorityFill}
                    style={{
                      width: total > 0
                        ? `${(p.count / total) * 100}%`
                        : '0%',
                      background: p.color,
                    }}
                  />
                </div>
                <span className={styles.priorityCount}>{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: Weather + Pomodoro */}
        <WeatherWidget />
        <PomodoroTimer />

        {/* Row 5: Heatmap — full width */}
        <div className={`${styles.sectionCard} ${styles.gridFull}`}>
          <div className={styles.sectionHeader}>
            <h3>🔥 Productivity Heatmap — Last 28 Days</h3>
          </div>

          <div className={styles.heatmapWrapper}>
            <div className={styles.daysGrid}>
              {HEATMAP.map((lvl, i) => (
                <div
                  key={i}
                  className={`${styles.dayCell} ${LEVEL[lvl]?.cls || ''}`}
                  title={`Day ${i + 1}: ${LEVEL[lvl]?.label}`}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className={styles.daysLegend}>
            <span className={styles.legendText}>Less</span>
            {[
              { bg: 'var(--bg-primary)',   label: 'None'   },
              { bg: 'var(--accent-light)', label: 'Low'    },
              { bg: '#a5b4fc',             label: 'Medium' },
              { bg: 'var(--accent)',       label: 'High'   },
            ].map((item) => (
              <div key={item.label} className={styles.legendItem}>
                <div
                  className={styles.legendDot}
                  style={{ background: item.bg }}
                />
                <span>{item.label}</span>
              </div>
            ))}
            <span className={styles.legendText}>More</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
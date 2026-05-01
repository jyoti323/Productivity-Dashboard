import React, { memo } from 'react'
import { useDispatch } from 'react-redux'
import { deleteTask } from '../redux/taskSlice'
import { formatDate, getPriorityColor, getStatusColor } from '../utils/helpers'
import styles from './TaskCard.module.css'

// memo → only re-renders if task/onEdit props change
const TaskCard = memo(function TaskCard({ task, onEdit, dragHandleProps, isDragging }) {
  const dispatch = useDispatch()

  return (
    <div className={`${styles.card} ${isDragging ? styles.dragging : ''}`}>
      {/* Drag Handle */}
      <div className={styles.dragHandle} {...dragHandleProps} title="Drag to reorder">
        
      </div>

      {/* Left: Task Info */}
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h4 className={styles.title}>{task.title}</h4>
          <div className={styles.badges}>
            {/* Priority Badge */}
            <span
              className="badge"
              style={{
                background: getPriorityColor(task.priority) + '18',
                color: getPriorityColor(task.priority),
              }}
            >
              {task.priority === 'high'   ? '🔴' :
               task.priority === 'medium' ? '🟡' : '🟢'} {task.priority}
            </span>

            {/* Status Badge */}
            <span className={`badge badge-${task.status}`}>
              {task.status === 'completed'   ? '' :
               task.status === 'in-progress' ? '' : ''} {task.status}
            </span>
          </div>
        </div>

        <p className={styles.desc}>{task.description}</p>

        <div className={styles.footer}>
          {/* Status Indicator Bar */}
          <div className={styles.statusBar}>
            <div
              className={styles.statusFill}
              style={{
                width: task.status === 'completed'   ? '100%' :
                       task.status === 'in-progress' ? '50%'  : '10%',
                background: getStatusColor(task.status),
              }}
            />
          </div>
          <span className={styles.date}> {formatDate(task.createdAt)}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className={styles.actions}>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(task)}
          title="Edit Task"
        >
          ✏️
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => dispatch(deleteTask(task.id))}
          title="Delete Task"
        >
          
        </button>
      </div>
    </div>
  )
})

export default TaskCard
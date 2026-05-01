import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addTask, updateTask } from '../redux/taskSlice'
import { generateId } from '../utils/helpers'
import styles from './TaskForm.module.css'

// This form handles both ADD and EDIT
// If 'editTask' prop is passed → edit mode, else → add mode

function TaskForm({ onClose, editTask = null }) {
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    title:       '',
    description: '',
    priority:    'medium',
    status:      'pending',
  })

  const [errors, setErrors] = useState({})

  // If editing, pre-fill form
  useEffect(() => {
    if (editTask) {
      setForm({
        title:       editTask.title,
        description: editTask.description,
        priority:    editTask.priority,
        status:      editTask.status,
      })
    }
  }, [editTask])

  const validate = () => {
    const errs = {}
    if (!form.title.trim())
      errs.title = 'Task title is required'
    if (!form.description.trim())
      errs.description = 'Description is required'
    return errs
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
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

    if (editTask) {
      // UPDATE existing task
      dispatch(updateTask({
        ...editTask,
        ...form,
      }))
    } else {
      // ADD new task
      dispatch(addTask({
        id:          generateId(),
        ...form,
        createdAt:   new Date().toISOString(),
      }))
    }

    onClose()
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h3>{editTask ? '✏️ Edit Task' : '➕ Add New Task'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Task Title *</label>
            <input
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              type="text"
              name="title"
              placeholder="e.g. Complete React assignment"
              value={form.title}
              onChange={handleChange}
            />
            {errors.title && (
              <span className={styles.errorText}>⚠️ {errors.title}</span>
            )}
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Description *</label>
            <textarea
              className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              name="description"
              placeholder="Brief description of the task..."
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
            {errors.description && (
              <span className={styles.errorText}>⚠️ {errors.description}</span>
            )}
          </div>

          {/* Priority + Status — side by side */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Priority</label>
              <select
                className={styles.select}
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select
                className={styles.select}
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="pending"> Pending</option>
                <option value="in-progress"> In Progress</option>
                <option value="completed"> Completed</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {editTask ? ' Save Changes' : '➕ Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
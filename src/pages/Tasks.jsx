import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { reorderTasks } from '../redux/taskSlice'
import useDebounce from '../hooks/useDebounce'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import styles from './Tasks.module.css'

function Tasks() {
  const dispatch       = useDispatch()
  const tasks          = useSelector((state) => state.tasks.tasks)

  // UI state
  const [showForm, setShowForm]   = useState(false)
  const [editTask, setEditTask]   = useState(null)

  // Search + Filter + Sort state
  const [search,     setSearch]   = useState('')
  const [filterStatus,  setFilterStatus]  = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [sortBy,     setSortBy]   = useState('newest')

  // Debounced search — waits 400ms after user stops typing
  const debouncedSearch = useDebounce(search, 400)

  // ── Derived: filtered + sorted tasks (useMemo for performance) ──
  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    // 1. Search filter
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      )
    }

    // 2. Status filter
    if (filterStatus !== 'all') {
      result = result.filter((t) => t.status === filterStatus)
    }

    // 3. Priority filter
    if (filterPriority !== 'all') {
      result = result.filter((t) => t.priority === filterPriority)
    }

    // 4. Sort
    result.sort((a, b) => {
      if (sortBy === 'newest')
        return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'oldest')
        return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'priority') {
        const order = { high: 0, medium: 1, low: 2 }
        return order[a.priority] - order[b.priority]
      }
      if (sortBy === 'title')
        return a.title.localeCompare(b.title)
      return 0
    })

    return result
  }, [tasks, debouncedSearch, filterStatus, filterPriority, sortBy])

  // ── Handlers ──
  const handleEdit = (task) => {
    setEditTask(task)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditTask(null)
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilterStatus('all')
    setFilterPriority('all')
    setSortBy('newest')
  }

  const isFiltering =
    debouncedSearch || filterStatus !== 'all' || filterPriority !== 'all'

  // ── Drag & Drop handler ──
  const handleDragEnd = (result) => {
    // Dropped outside the list
    if (!result.destination) return
    // Same position
    if (result.destination.index === result.source.index) return

    // Reorder the FILTERED list, then merge back into full list
    const reordered = [...filteredTasks]
    const [moved]   = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)

    // Build new full task list preserving non-filtered tasks
    const filteredIds    = new Set(filteredTasks.map((t) => t.id))
    const nonFiltered    = tasks.filter((t) => !filteredIds.has(t.id))
    dispatch(reorderTasks([...reordered, ...nonFiltered]))
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1> My Tasks</h1>
          <p>{tasks.length} total tasks · {filteredTasks.length} shown</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => { setEditTask(null); setShowForm(true) }}
        >
          ➕ Add Task
        </button>
      </div>

      {/* Controls: Search + Filter + Sort */}
      <div className={styles.controls}>
        {/* Debounced Search */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter by Status */}
        <select
          className={styles.select}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending"> Pending</option>
          <option value="in-progress"> In Progress</option>
          <option value="completed"> Completed</option>
        </select>

        {/* Filter by Priority */}
        <select
          className={styles.select}
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All Priority</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        {/* Sort */}
        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest"> Newest</option>
          <option value="oldest"> Oldest</option>
          <option value="priority"> Priority</option>
          <option value="title"> A → Z</option>
        </select>
      </div>

      {/* Results Info + Clear */}
      <div className={styles.resultsInfo}>
        <span className={styles.resultsCount}>
          Showing {filteredTasks.length} of {tasks.length} tasks
          {debouncedSearch && ` for "${debouncedSearch}"`}
        </span>
        {isFiltering && (
          <button className={styles.clearBtn} onClick={handleClearFilters}>
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* Task List with Drag & Drop */}
      {filteredTasks.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            {isFiltering ? '' : ''}
          </div>
          <h3>
            {isFiltering ? 'No tasks match your search' : 'No tasks yet!'}
          </h3>
          <p>
            {isFiltering
              ? 'Try changing your filters or search term'
              : 'Click "Add Task" to create your first task'}
          </p>
          {isFiltering && (
            <button className={styles.clearBtn} onClick={handleClearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="task-list">
            {(provided) => (
              <div
                className={styles.taskList}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {filteredTasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <TaskCard
                          task={task}
                          onEdit={handleEdit}
                          isDragging={snapshot.isDragging}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          onClose={handleCloseForm}
          editTask={editTask}
        />
      )}
    </div>
  )
}

export default Tasks
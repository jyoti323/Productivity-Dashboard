import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tasks: [
    // Some sample tasks so dashboard isn't empty on first load
    {
      id: '1',
      title: 'Complete React project',
      description: 'Finish the capstone dashboard project',
      priority: 'high',
      status: 'in-progress',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Study Redux Toolkit',
      description: 'Understand slices and store',
      priority: 'medium',
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Practice CSS Flexbox',
      description: 'Build responsive layouts',
      priority: 'low',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ],
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action) {
      state.tasks.push(action.payload)
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload)
    },
    updateTask(state, action) {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = action.payload
      }
    },
    reorderTasks(state, action) {
      // Used for drag and drop
      state.tasks = action.payload
    },
  },
})

export const { addTask, deleteTask, updateTask, reorderTasks } = taskSlice.actions
export default taskSlice.reducer
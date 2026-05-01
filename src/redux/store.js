import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './taskSlice'
import authReducer from './authSlice'
import settingsReducer from './settingsSlice'

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    auth: authReducer,
    settings: settingsReducer,
  },
})
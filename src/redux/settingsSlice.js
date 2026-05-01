import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  darkMode: false,
  userName: 'Student',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode
    },
    updateUserName(state, action) {
      state.userName = action.payload
    },
  },
})

export const { toggleDarkMode, updateUserName } = settingsSlice.actions
export default settingsSlice.reducer
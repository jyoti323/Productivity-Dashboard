import { createSlice } from '@reduxjs/toolkit'

// Mock login — no real backend needed
const initialState = {
  isLoggedIn: false,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true
      state.user = action.payload // { name, email }
    },
    logout(state) {
      state.isLoggedIn = false
      state.user = null
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '@/redux'

// Define a type for the slice state
interface IUserState {
  uid: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  roles: string[]
  authenticated: boolean
}

// Define the initial state using that type
const initialState: IUserState = {
  uid: '',
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  roles: [],
  authenticated: false,
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateUser: (state, action: PayloadAction<IUserState>) => {
      state.uid = action.payload.uid ?? ''
      state.firstName = action.payload.firstName ?? ''
      state.lastName = action.payload.lastName ?? ''
      state.email = action.payload.email ?? ''
      state.mobile = action.payload.mobile ?? ''
      state.roles = action.payload.roles ?? []
      state.authenticated = action.payload.authenticated ?? false
    },
  },
})

// dispatch actions
export const {updateUser} = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUserUid = (state: RootState) => state.user.uid
export const selectUserFirstName = (state: RootState) => state.user.firstName
export const selectUserLastName = (state: RootState) => state.user.lastName
export const selectUserEmail = (state: RootState) => state.user.email
export const selectUserMobile = (state: RootState) => state.user.mobile
export const selectUserRoles = (state: RootState) => state.user.roles
export const selectUserAuthenticated = (state: RootState) =>
  state.user.authenticated

export default userSlice.reducer

import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '@/redux'

/*********************************************
   #1 -- Define a type for the slice state
**********************************************/
interface IUserState {
  uid: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  bio?: string
  roles?: string[]
  accessToken?: string
  refreshToken?: string
  expirationTime?: number
}

/*********************************************
   #2 -- Define the initial state
**********************************************/
const initialState: IUserState = {
  uid: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  bio: '',
  roles: [],
  accessToken: '',
  refreshToken: '',
  expirationTime: 0,
}

/*********************************************
   #3 -- Create Slice / Reducer
**********************************************/
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<IUserState | undefined>) => {
      state.uid = action.payload?.uid ?? state.uid
      state.firstName = action.payload?.firstName ?? state.firstName
      state.lastName = action.payload?.lastName ?? state.lastName
      state.email = action.payload?.email ?? state.email
      state.phone = action.payload?.phone ?? state.phone
      state.bio = action.payload?.bio ?? state.bio
      state.roles = action.payload?.roles ?? state.roles
      state.accessToken = action.payload?.accessToken ?? state.accessToken
      state.refreshToken = action.payload?.refreshToken ?? state.refreshToken
      state.expirationTime =
        action.payload?.expirationTime ?? state.expirationTime
    },
    resetUser: state => {
      state.uid = initialState.uid
      state.firstName = initialState.firstName
      state.lastName = initialState.lastName
      state.email = initialState.email
      state.phone = initialState.phone
      state.bio = initialState.bio
      state.roles = initialState.roles
      state.accessToken = initialState.accessToken
      state.refreshToken = initialState.refreshToken
      state.expirationTime = initialState.expirationTime
    },
  },
})

/*********************************************
   #4 -- dispatch actions
**********************************************/
export const {updateUser, resetUser} = userSlice.actions

/*********************************************
   #5 -- dispatch selectors
**********************************************/
export const selectUserUid = (state: RootState) => state.user.uid
export const selectUserFirstName = (state: RootState) => state.user.firstName
export const selectUserLastName = (state: RootState) => state.user.lastName
export const selectUserEmail = (state: RootState) => state.user.email
export const selectUserPhone = (state: RootState) => state.user.phone
export const selectUserBio = (state: RootState) => state.user.bio
export const selectUserRoles = (state: RootState) => state.user.roles
export const selectUserAccessToken = (state: RootState) =>
  state.user.accessToken
export const selectUserRefreshToken = (state: RootState) =>
  state.user.refreshToken
export const selectUserExpirationTime = (state: RootState) =>
  state.user.expirationTime

/*********************************************
   #6 -- export reducer
**********************************************/
export default userSlice.reducer

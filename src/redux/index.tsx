import {configureStore} from '@reduxjs/toolkit'
import {createLogger} from 'redux-logger'
import userReducer from './user/userSlice'

const loggerMiddleware = createLogger({
  // Specify any desired configuration options for the logger
  // For example: collapsed: true
})

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: process.env.NODE_ENV === 'development' ? [loggerMiddleware] : [],
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

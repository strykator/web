import {configureStore, combineReducers} from '@reduxjs/toolkit'
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {createLogger} from 'redux-logger'
import userReducer from './user/userSlice'
import cartReducer from './cart/cartSlice'

// REDUX LOGGER
const loggerMiddleware = createLogger({
  // Specify any desired configuration options for the logger
  collapsed: true,
})

// ROOT REDUCER
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
})

// REDUX PERSIST CONFIG
const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

// REDUX STORE
export const store = configureStore({
  reducer: persistedReducer,
  middleware: process.env.NODE_ENV === 'development' ? [loggerMiddleware] : [],
})

// REDUX PERSISTOR
export const persistor = persistStore(store)

// REDUX GENERAL TYPES
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '@/redux'
import {updateTotalPriceAndQuantity, handleUpdateItem} from './utils'

/*********************************************
   #1 -- Define a type for the slice state
**********************************************/
export type Item = {
  itemId: string
  name: string
  price: number
  quantity: number
  photoUrl: string
  options?: {
    name: string
    price?: number
  }
}
export interface ICartSlice {
  userId: string
  entityId: string
  items: Item[]
  totalPrice: number
  totalQuantity: number
}

/*********************************************
   #2 -- Define the initial state
**********************************************/
export const initialState: ICartSlice = {
  userId: '',
  entityId: '',
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
}

/*********************************************
   #3 -- Create Slice / Reducer
**********************************************/
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload)
      updateTotalPriceAndQuantity(state)
    },
    removeItem: (state, action: PayloadAction<{itemId: string}>) => {
      state.items = state.items.filter(
        item => item.itemId !== action.payload.itemId,
      )
      updateTotalPriceAndQuantity(state)
    },
    updateItem: (state, action: PayloadAction<Item>) => {
      const updatedItem = action.payload
      handleUpdateItem(state, updatedItem)
      updateTotalPriceAndQuantity(state)
    },
    increaseItemQuantity: (state, action: PayloadAction<Item>) => {
      const updatedItem = {
        ...action.payload,
        quantity: action.payload.quantity + 1,
      }
      handleUpdateItem(state, updatedItem)
      updateTotalPriceAndQuantity(state)
    },
    decreaseItemQuantity: (state, action: PayloadAction<Item>) => {
      const updatedItem = {
        ...action.payload,
        quantity: action.payload.quantity - 1,
      }
      handleUpdateItem(state, updatedItem)
      updateTotalPriceAndQuantity(state)
    },
    emptyCart: state => {
      state.userId = initialState.userId
      state.entityId = initialState.entityId
      state.items = initialState.items
      state.totalPrice = initialState.totalPrice
      state.totalQuantity = initialState.totalQuantity
    },
    addOrUpdateCartIds: (
      state,
      action: PayloadAction<{userId: string; entityId: string}>,
    ) => {
      if (state.entityId !== action.payload.entityId)
        state.entityId = action.payload.entityId
      if (state.userId !== action.payload.userId)
        state.userId = action.payload.userId
    },
  },
})

/*********************************************
   #4 -- dispatch actions
**********************************************/
export const {
  addItem,
  removeItem,
  updateItem,
  emptyCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  addOrUpdateCartIds,
} = cartSlice.actions

/*********************************************
   #5 -- dispatch selectors
**********************************************/
export const selectUserId = (state: RootState) => state.cart.userId
export const selectEntityId = (state: RootState) => state.cart.entityId
export const selectItems = (state: RootState) => state.cart.items
export const selectTotalPrice = (state: RootState) => state.cart.totalPrice
export const selectTotalQuantity = (state: RootState) =>
  state.cart.totalQuantity

/*********************************************
   #6 -- export reducer
**********************************************/
export default cartSlice.reducer

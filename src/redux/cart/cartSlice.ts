import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '@/redux'
import {updateTotalPriceAndQuantity} from './utils'

/*********************************************
   #1 -- Define a type for the slice state
**********************************************/
export type Item = {
  itemId: string
  name: string
  price: number
  quantity: number
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
      state.items = state.items.map(item => {
        if (item.itemId === updatedItem.itemId) {
          return updatedItem
        }
        return item
      })
      updateTotalPriceAndQuantity(state)
    },
    emptyCart: state => {
      state.userId = initialState.userId
      state.entityId = initialState.entityId
      state.items = initialState.items
      state.totalPrice = initialState.totalPrice
      state.totalQuantity = initialState.totalQuantity
    },
  },
})

/*********************************************
   #4 -- dispatch actions
**********************************************/
export const {addItem, removeItem, updateItem, emptyCart} = cartSlice.actions

/*********************************************
   #5 -- dispatch selectors
**********************************************/
export const selectEntityId = (state: RootState) => state.cart.entityId
export const selectItems = (state: RootState) => state.cart.items
export const selectTotalPrice = (state: RootState) => state.cart.totalPrice
export const selectTotalQuantity = (state: RootState) =>
  state.cart.totalQuantity

/*********************************************
   #6 -- export reducer
**********************************************/
export default cartSlice.reducer

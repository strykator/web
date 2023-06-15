import {Item, ICartSlice} from './cartSlice'

export const calculateTotalPriceAndQuantity = (items: Item[]) => {
  let totalPrice = 0
  let totalQuantity = 0
  items.forEach(item => {
    totalPrice += item.price * item.quantity
    totalQuantity += item.quantity
  })
  return {totalPrice, totalQuantity}
}

export const updateTotalPriceAndQuantity = (state: ICartSlice) => {
  const {totalPrice, totalQuantity} = calculateTotalPriceAndQuantity(
    state.items,
  )
  state.totalPrice = totalPrice
  state.totalQuantity = totalQuantity
}

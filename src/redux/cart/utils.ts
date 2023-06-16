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

export const handleUpdateItem = (state: ICartSlice, item: Item) => {
  const updatedItem = item
  state.items = state.items.map(item => {
    if (item.itemId === updatedItem.itemId) {
      return updatedItem
    }
    return item
  })
}

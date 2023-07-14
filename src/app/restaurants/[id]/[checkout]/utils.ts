import {IFormInput} from './page'
import {TItem, ICartSlice} from '@/redux/cart/cartSlice'
import {TOrderPayload} from '@/libs/types'

export const calTaxes = (total: number, discount: number) =>
  parseFloat(((total - discount) * 0.1).toFixed(2))
export const calTotal = (total: number, tip: number, discount: number) => {
  const myTotal = (total - discount + calTaxes(total, discount) + tip).toFixed(
    2,
  )
  return parseFloat(myTotal)
}

type TPrepareOrderPayload = {
  data: IFormInput
  shoppingCart: ICartSlice
  tip: number
  discount: number
}
export const prepareOrderPayload = ({
  data,
  shoppingCart,
  tip,
  discount,
}: TPrepareOrderPayload): TOrderPayload => {
  const taxes = calTaxes(shoppingCart.totalPrice, discount)
  const totalAmount = calTotal(shoppingCart.totalPrice, tip, discount)
  const items = shoppingCart.items?.map((item: TItem) => ({
    itemId: item.itemId,
    itemName: item.name,
    itemPrice: item.price,
    itemQuantity: item.quantity,
    itemOptions: item.options ? item.options : [],
  }))

  const payload = {
    customerEmail: data.email.trim(),
    customerName: data.name.trim(),
    customerPhone: data.phone.replace(/[^\d]/g, ''),
    entityId: shoppingCart.entityId.trim(),
    items,
    paymentMethod: data.paymentType.trim(),
    shippingAddress: {
      zipcode: data.zipcode.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      street: data.address.trim(),
      country: data.country.trim(),
    },
    status: 'pending',
    timestamp: new Date().getTime(),
    totalAmount,
    totalQuantity: shoppingCart.totalQuantity,
    tip,
    taxes,
    promoCode: data.promoCode.trim(),
  }
  return payload
}

import {TItemOptions} from '@/redux/cart/cartSlice'

export type TOrderPayload = {
  customerEmail: string
  customerName: string
  customerPhone: string
  entityId: string
  items: {
    itemId: string
    itemName: string
    itemOptions?: TItemOptions[]
    itemPrice: number
    itemQuantity: number
  }[]
  paymentMethod: string
  shippingAddress: {
    zipcode?: string
    city: string
    state: string
    street: string
    country?: string
  }
  status: string
  timestamp: number
  totalAmount: number
  totalQuantity: number
  tip: number
  taxes: number
  promoCode: string
}

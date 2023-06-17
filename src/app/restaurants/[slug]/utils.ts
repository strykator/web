import {restaurants} from '@/constants'

export const getRestaurantById = (id: string) => {
  return restaurants.filter(item => item.id === id)[0]
}

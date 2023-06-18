import numeral from 'numeral'
import {restaurants} from '@/constants'

export const truncate = (words: string, n: number) => {
  if (!words) return ''

  return `${words.slice(0, n)}...`
}

export const formatCurrency = (number: number) => {
  return numeral(number).format('$0,0.00')
}

export const getRestaurantById = (id: string) => {
  return restaurants.filter(item => item.id === id)[0]
}

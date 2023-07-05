import numeral from 'numeral'
import {restaurants} from '@/constants'

export {schemaFormCheckout, schemaFormProfile} from './schemas'

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

export const formatPhoneInput = (value: string | undefined): string => {
  if (!value) return ''

  if (value) {
    // Remove non-digit characters
    const digitsOnly = value.replace(/[^\d]/g, '')

    // Limit to 10 characters
    const limitedValue = digitsOnly.slice(0, 10)

    // Insert dashes after every 3 digits but not the last set of digits
    const formattedValue = limitedValue.replace(
      /(\d{3})(\d{3})(\d+)/,
      '$1-$2-$3',
    )

    return formattedValue
  }
  return value
}

export const formatVisaCardNumber = (value: string) => {
  if (value) {
    // Remove non-digit characters
    const digitsOnly = value.replace(/[^\d]/g, '')

    // Limit to 16 characters
    const limitedValue = digitsOnly.slice(0, 16)

    // Insert space after every four digits
    const formattedValue = limitedValue.replace(/(\d{4})(?=\d)/g, '$1 ')

    return formattedValue
  }
  return value
}

export const formatExpirationDate = (value: string) => {
  if (value) {
    // Remove non-digit characters
    const digitsOnly = value.replace(/[^\d]/g, '')

    // Limit to 4 characters
    const limitedValue = digitsOnly.slice(0, 4)

    // Insert slash after the first two digits
    const formattedValue = limitedValue.replace(/(\d{2})(?=\d)/g, '$1/')

    return formattedValue
  }
  return value
}

export const sanitizeData = (data: any) => {
  if (!data) return data
  const sanitizedData = {
    ...data,
    phone: data.phone.replace(/[^\d]/g, ''),
    cardNumber: data.cardNumber?.replace(/[^\d]/g, ''),
    expiration: data.expiration?.replace(/[^\d]/g, ''),
  }

  return sanitizedData
}

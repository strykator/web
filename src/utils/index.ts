import numeral from 'numeral'
import {format} from 'date-fns'
import {restaurants} from '@/constants'
import {IAddress} from './types'

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

export const formatDateAndTime = (timestamp: number) => {
  return {
    date: format(new Date(+timestamp), 'dd MMM yyyy'),
    time: format(new Date(+timestamp), 'hh:mm a'),
  }
}
export const convertDateToTimestamp = (date: Date, startDay?: boolean) => {
  const temp = new Date(date)
  temp.setHours(startDay ? 0 : 23)
  temp.setMinutes(startDay ? 0 : 59)
  temp.setSeconds(startDay ? 1 : 59)
  return temp.getTime()
}
export const getOrderStatusChipColor = (status: string) => {
  if (status === 'pending') {
    return 'warning'
  } else if (status === 'confirmed') {
    return 'primary'
  } else if (status === 'completed') {
    return 'success'
  } else if (status === 'cancelled') {
    return 'error'
  } else if (status === 'refunded') {
    return 'default'
  } else {
    return 'default'
  }
}
export const formatAddress = (address: IAddress) => {
  if (!address) return ''
  const {street, city, state, zipcode, country} = address
  return `${street ? `${street}, ` : null}${city ? `${city}, ` : null}${
    state ? `${state} ` : null
  }${zipcode ? `${zipcode}, ` : null}${country ? `${country}, ` : null}`
}
export const getVisibleRows = (
  rows: any[],
  page: number,
  rowsPerPage: number,
) => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

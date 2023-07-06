import axios from 'axios'
import {restAPI, baseURL} from './config'

export const fetchUserById = async (id: string) => {
  return restAPI.get(`${baseURL}/user/${id}`).then(res => res.data)
}

// GOOGLE MAPS
const baseGoogleApi = 'http://localhost:4000/google/place_api'

export type TPlaceAutocomplete = {
  placeId: string
  fullAddress: string
  street: string
  city: string
  state: string
  country: string
}
export const fetchPlaceAutocomplete = async (
  search: string,
): Promise<TPlaceAutocomplete[] | []> => {
  if (!search) return []
  try {
    const response = await axios.get(`${baseGoogleApi}/autocomplete/${search}`)
    const predictions = response.data
    return predictions
  } catch (error) {
    console.error('fetchPlaceAutocomplete error:', error)
    return []
  }
}

export const fetchZipcode = async (placeId: string) => {
  if (!placeId) return
  try {
    const response = await axios.get(`${baseGoogleApi}/details/${placeId}`)
    const zipcode = response.data
    return `${zipcode}`
  } catch (error) {
    console.error('fetchZipcode error:', error)
  }
}

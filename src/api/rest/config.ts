import axios from 'axios'
import {store} from '@/redux'

const token = store.getState()?.user.accessToken ?? ''

export const baseURL = process.env.NEXT_PUBLIC_REST_API_URL ?? ''
export const restAPI = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})

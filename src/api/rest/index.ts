import axios from 'axios'

const baseRestUrl = process.env.NEXT_PUBLIC_REST_API_URL ?? ''

export const fetchUserById = async (id: string) => {
  return axios.get(`${baseRestUrl}/user/${id}`).then(res => res.data)
}

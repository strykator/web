import {restAPI, baseURL} from './config'

export const fetchUserById = async (id: string) => {
  return restAPI.get(`${baseURL}/user/${id}`).then(res => res.data)
}

export interface IItem {
  id: string
  name: string
  quantity: number
  price: number
}
export interface ICustomer {
  name: string
  email: string
  phone: string
  photoUrl: string
}
export interface ITableHead {
  order: string
  customer: ICustomer
  date: number
  quantity: number
  total: number
  status: string
  items: IItem[]
  extras: string
}
export interface ITableToolbarProps {
  numSelected: number
  onRefresh: any
  startDate: any
  endDate: any
  search: string
  setStartDate: any
  setEndDate: any
  setSearch: any
  statuses: string[]
  setStatuses: any
}

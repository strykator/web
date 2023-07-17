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
export interface IData {
  order: string
  customer: ICustomer
  date: number
  quantity: number
  total: number
  status: string
  items: IItem[]
  extras: string
}
export interface IHeadCell {
  disablePadding: boolean
  id: keyof IData
  label: string
  numeric: boolean
  width: string
}
export type TOrder = 'asc' | 'desc'
export interface IEnhancedTableProps {
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IData,
  ) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: TOrder
  orderBy: string
  rowCount: number
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

import {IHeadCell, ICustomer, IItem, IData} from './types'

export const headCells: readonly IHeadCell[] = [
  {
    id: 'order',
    numeric: false,
    disablePadding: true,
    width: '10%',
    label: 'Order',
  },
  {
    id: 'customer',
    numeric: false,
    disablePadding: false,
    width: '30%',
    label: 'Customer',
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    width: '20%',
    label: 'Date',
  },
  {
    id: 'quantity',
    numeric: true,
    disablePadding: false,
    width: '10%',
    label: 'Quantity',
  },
  {
    id: 'total',
    numeric: true,
    disablePadding: false,
    width: '10%',
    label: 'Total',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    width: '15%',
    label: 'Status',
  },
  {
    id: 'extras',
    numeric: false,
    disablePadding: false,
    width: '10%',
    label: '',
  },
]

export const statusArray = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'refunded',
]

export const createData = (
  order: string,
  customer: ICustomer,
  date: number,
  quantity: number,
  total: number,
  status: string,
  items: IItem[],
  extras?: string,
): IData => {
  return {
    order,
    customer,
    date,
    quantity,
    total,
    status,
    items,
    extras: '',
  }
}

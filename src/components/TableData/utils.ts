import {IHeadCell, ICustomer, IItem, IData} from './types'

export const headCells: readonly IHeadCell<IData>[] = [
  {
    id: 'order',
    disablePadding: true,
    width: '10%',
    label: 'Order',
  },
  {
    id: 'customer',
    disablePadding: false,
    width: '30%',
    label: 'Customer',
  },
  {
    id: 'date',
    disablePadding: false,
    width: '20%',
    label: 'Date',
  },
  {
    id: 'quantity',
    disablePadding: false,
    width: '10%',
    label: 'Quantity',
  },
  {
    id: 'total',
    disablePadding: false,
    width: '10%',
    label: 'Total',
  },
  {
    id: 'status',
    disablePadding: false,
    width: '15%',
    label: 'Status',
  },
  {
    id: 'extras',
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

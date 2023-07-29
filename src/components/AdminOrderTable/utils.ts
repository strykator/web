import {ICustomer, IItem, ITableHead} from './types'
import {IHeadCell} from '@/components/table/types'
export const headCells: IHeadCell[] = [
  {
    id: 'order',
    align: 'left',
    width: '10%',
    label: 'Order',
  },
  {
    id: 'customer',
    align: 'left',
    width: '30%',
    label: 'Customer',
  },
  {
    id: 'date',
    align: 'left',
    width: '20%',
    label: 'Date',
  },
  {
    id: 'quantity',
    align: 'left',
    width: '10%',
    label: 'Quantity',
  },
  {
    id: 'total',
    align: 'left',
    width: '10%',
    label: 'Total',
  },
  {
    id: 'status',
    align: 'left',
    width: '15%',
    label: 'Status',
  },
  {
    id: 'extras',
    align: 'left',
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
): ITableHead => {
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

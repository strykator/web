import {ITableHead} from './types'
import {IHeadCell} from '@/components/table/types'
export const headCells: IHeadCell[] = [
  {
    id: 'product',
    label: 'Product',
    align: 'left',
    width: '30%',
  },
  {
    id: 'category',
    label: 'Category',
    align: 'left',
    width: '20%',
  },
  {
    id: 'stock',
    label: 'Stock',
    align: 'left',
    width: '20%',
  },
  {
    id: 'price',
    label: 'Price',
    align: 'left',
    width: '10%',
  },
  {
    id: 'status',
    label: 'Status',
    align: 'left',
    width: '10%',
  },
  {
    id: 'extras',
    label: '',
    align: 'left',
    width: '10%',
  },
]

export const statusArray = ['published', 'draft']

export const createData = (
  id: string,
  product: string,
  category: string,
  stock: number,
  price: number,
  status: string,
  extras?: string,
): ITableHead => {
  return {
    id,
    product,
    category,
    stock,
    price,
    status,
    extras: '',
  }
}

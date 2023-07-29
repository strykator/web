import React from 'react'
import {
  Box,
  TableCell,
  TableHead as MuiTableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
} from '@mui/material'
import {visuallyHidden} from '@mui/utils'
import {IHeadCell, TOrder} from '../types'

export type THeadCellId = IHeadCell['id']

export interface ITableHead {
  numSelected: number
  onSelectAllClick: any
  order: TOrder
  setOrder: any
  setOrderBy: any
  orderBy: string
  rowCount: number
  headCells: IHeadCell[]
}

export default function TableHead({
  onSelectAllClick,
  order,
  setOrder,
  orderBy,
  setOrderBy,
  numSelected,
  rowCount,
  headCells,
}: ITableHead) {
  const onRequestSort =
    (headCellId: THeadCellId) => (event: React.MouseEvent<unknown>) => {
      const isAsc = orderBy === headCellId && order === 'asc'
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(headCellId)
    }

  return (
    <MuiTableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all orders',
            }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            sx={{
              width: headCell.width,
            }}
            align={headCell.align}
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}>
            {headCell.id !== 'extras' && (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={
                  headCell.id !== 'order'
                    ? onRequestSort(headCell.id)
                    : () => {}
                }>
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </MuiTableHead>
  )
}

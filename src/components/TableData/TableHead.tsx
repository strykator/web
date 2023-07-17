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
import {IData, IEnhancedTableProps} from './types'
import {headCells} from './utils'

export default function TableHead({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
}: IEnhancedTableProps) {
  const createSortHandler =
    (property: keyof IData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
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
            align="left"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            {headCell.id !== 'extras' && (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={
                  headCell.id !== 'order'
                    ? createSortHandler(headCell.id)
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

import React from 'react'
import {TableRow, TableCell} from '@mui/material'

interface IEmptyRows {
  page: number
  rowsPerPage: number
  rowsLength: number
  dense: boolean
}

export default function EmptyRows({
  page,
  rowsPerPage,
  rowsLength,
  dense,
}: IEmptyRows) {
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsLength) : 0

  return (
    emptyRows > 0 && (
      <TableRow
        style={{
          height: (dense ? 33 : 53) * emptyRows,
        }}>
        <TableCell colSpan={8} />
      </TableRow>
    )
  )
}

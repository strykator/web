import React from 'react'
import styled from 'styled-components'
import {Box, TablePagination, FormControlLabel, Switch} from '@mui/material'

interface ITableFooter {
  count: number
  rowsPerPage: number
  page: number
  dense: boolean
  setPage: any
  setRowsPerPage: any
  setDense: any
}

export default function TableFooter({
  count,
  rowsPerPage,
  page,
  setPage,
  setRowsPerPage,
  dense,
  setDense,
}: ITableFooter) {
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Container>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense"
      />
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  )
}

const Container = styled(Box)`
  display: flex;
  padding-left: 20px;
  flex-direction: row;
  justify-content: space-between;
`

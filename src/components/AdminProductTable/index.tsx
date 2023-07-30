'use client'

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useRouter} from 'next/navigation'
import {useQuery} from '@tanstack/react-query'
import {
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  Checkbox,
  Collapse,
  Menu,
  MenuItem,
  ListItemIcon,
  Chip,
  Popover,
  Stack,
} from '@mui/material'
import {
  KeyboardArrowDown,
  MoreVert,
  DeleteForever,
  Visibility,
  Edit,
} from '@mui/icons-material'
import {getProductList, deleteProduct, updateProduct} from '@/libs/firebase'
import {formatCurrency, getProductStatusChipColor} from '@/utils'
import {theme} from '@/theme'
import {statusArray, createData} from './utils'
import TableHead from '@/components/table/TableHead'
import TableFooter from '@/components/table/TableFooter'
import EmptyRows from '@/components/table/EmptyRows'
import {TOrder} from '@/components/table/types'
import {headCells} from './utils'
import {getVisibleRows} from '@/utils'

const MoreOptions = ({
  id,
  onDelete,
  onView,
  onEdit,
}: {
  id: string
  onDelete: any
  onView?: any
  onEdit?: any
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const onClickMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleDelete = () => {
    handleClose()
    onDelete()
  }
  const handleView = () => {
    handleClose()
    onView()
  }
  const handleEdit = () => {
    handleClose()
    onEdit()
  }

  return (
    <>
      <IconButton onClick={onClickMore}>
        <MoreVert fontSize="small" />
      </IconButton>
      <StyledMenu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteForever fontSize="small" color="error" />
          </ListItemIcon>
          <Text>Delete</Text>
        </MenuItem>
        {onView && (
          <MenuItem onClick={handleView}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <Text>View</Text>
          </MenuItem>
        )}
        {onEdit && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <Text>Edit</Text>
          </MenuItem>
        )}
      </StyledMenu>
    </>
  )
}

const StatusOptions = ({
  id,
  label,
  onSelect,
}: {
  id: string
  label: string
  onSelect: any
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const onClick = (event: any) => {
    if (anchorEl) {
      setAnchorEl(null)
    } else {
      setAnchorEl(event.currentTarget)
    }
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleOnSelect = (option: string) => {
    handleClose()
    onSelect(option)
  }

  return (
    <>
      <Chip
        label={label}
        onClick={onClick}
        onDelete={onClick}
        deleteIcon={<KeyboardArrowDown />}
        color={getProductStatusChipColor(label)}
        variant="outlined"
        size="small"
      />
      <Popover
        id={id}
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '4px',
          }}>
          {statusArray.map((option: string) => {
            if (option === label) return null
            return (
              <MenuItem key={option} onClick={() => handleOnSelect(option)}>
                <Chip
                  label={option}
                  color={getProductStatusChipColor(option)}
                  variant="filled"
                  size="small"
                />
              </MenuItem>
            )
          })}
        </Box>
      </Popover>
    </>
  )
}

const defaultOrder = {
  order: 'desc',
  orderBy: 'product',
}
export default function AdminProductTable() {
  const router = useRouter()
  // Misc
  const [selected, setSelected] = useState<readonly string[]>([])
  // Sort
  const [order, setOrder] = useState<TOrder>(defaultOrder.order as TOrder)
  const [orderBy, setOrderBy] = useState<string>(defaultOrder.orderBy)
  // Footer
  const [dense, setDense] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rows, setRows] = useState<any[]>([])
  // Filters
  const [search, setSearch] = useState<string>('')
  const [statuses, setStatuses] = useState<string[]>([])
  // Query API
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: [
      'getProductList',
      {
        order,
        orderBy,
        statuses,
        limit: 100,
      },
    ],
    queryFn: getProductList,
  })
  useEffect(() => {
    if (data) {
      const formattedRows: any = []
      data?.forEach((item: any) => {
        formattedRows.push(
          createData(
            item.id,
            item.name,
            item.category,
            item.quantity,
            item.price,
            item.status,
          ),
        )
      })
      setRows(formattedRows)
    }
  }, [data])

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const visibleRows = React.useMemo(
    () => getVisibleRows(rows, page, rowsPerPage),
    [page, rowsPerPage, rows],
  )

  const handleDelete = async (id: string) => {
    const success = await deleteProduct(id)
    if (success) {
      refetch()
    } else {
      console.log('some thing went wrong')
    }
  }
  const handleUpdate = async (id: string, status: any) => {
    const fields = {status}
    const success = await updateProduct(id, fields)
    if (success) {
      refetch()
    } else {
      console.log('some thing went wrong')
    }
  }

  return (
    <Paper sx={{width: '100%'}}>
      <TableContainer>
        <Table
          sx={{minWidth: 750}}
          aria-labelledby="tableTitle"
          size={dense ? 'small' : 'medium'}>
          <TableHead
            numSelected={selected.length}
            order={order}
            setOrder={setOrder}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            onSelectAllClick={handleSelectAllClick}
            rowCount={rows.length}
            headCells={headCells}
          />
          <TableBody>
            {visibleRows.map((row, index) => {
              const isItemSelected = isSelected(row.id as string)
              const labelId = `enhanced-table-checkbox-${index}`

              return (
                <>
                  <TableRow
                    hover
                    onClick={() => {}}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}>
                    <TableCell
                      padding="checkbox"
                      onClick={event => handleClick(event, row.id as string)}>
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" id={labelId}>
                      <CellText>{row.product}</CellText>
                    </TableCell>
                    <TableCell align="left">
                      <CellText>{row.category}</CellText>
                    </TableCell>
                    <TableCell align="left">
                      <CellText>{row.stock}</CellText>
                    </TableCell>
                    <TableCell align="left">
                      <CellText>{formatCurrency(row.price)}</CellText>
                    </TableCell>
                    <TableCell align="left">
                      <StatusOptions
                        id={row.id}
                        label={row.status}
                        onSelect={(status: string) =>
                          handleUpdate(row.id, status)
                        }
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <MoreOptions
                          id={row.id}
                          onDelete={() => handleDelete(row.id)}
                          onEdit={() =>
                            router.push(`/admin/product/create?id=${row.id}`)
                          }
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                </>
              )
            })}
            <EmptyRows
              page={page}
              rowsPerPage={rowsPerPage}
              rowsLength={rows.length}
              dense={dense}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <TableFooter
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        dense={dense}
        setPage={setPage}
        setDense={setDense}
        setRowsPerPage={setRowsPerPage}
      />
    </Paper>
  )
}

const StyledMenu = styled(Menu)`
  & .MuiMenu-paper {
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 5px 10px -3px,
      rgba(0, 0, 0, 0.05) 0px 1px 1px -2px;
  }
  & .MuiMenu-List {
    padding: 4px 0px;
  }
`
const Text = styled(Typography)`
  font-size: ${theme.font.size.s};
  color: ${theme.color.text};
`
const CellText = styled(Typography)`
  font-size: ${theme.font.size.m};
  color: ${theme.color.text};
`
const CellTextWeak = styled(Typography)`
  font-size: ${theme.font.size.s};
  color: ${theme.color.textWeak};
`

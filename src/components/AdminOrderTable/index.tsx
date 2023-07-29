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
  KeyboardArrowRight,
  KeyboardArrowDown,
  MoreVert,
  DeleteForever,
  Visibility,
} from '@mui/icons-material'
import {getListOrder, deleteOrder, updateOrder} from '@/libs/firebase'
import {
  formatCurrency,
  formatDateAndTime,
  convertDateToTimestamp,
  getOrderStatusChipColor,
} from '@/utils'
import {theme} from '@/theme'
import {IItem, ICustomer} from './types'
import {statusArray, createData} from './utils'
import TableToolbar from './TableToolbar'
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
}: {
  id: string
  onDelete: any
  onView: any
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
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <Text>View</Text>
        </MenuItem>
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
        color={getOrderStatusChipColor(label)}
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
                  color={getOrderStatusChipColor(option)}
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
const CollapseArrowButton = ({onSelectedArrow, selectedArrows, row}: any) => {
  return (
    <IconButton onClick={() => onSelectedArrow(row.order)}>
      {selectedArrows.includes(row.order) ? (
        <KeyboardArrowDown fontSize="medium" color="info" />
      ) : (
        <KeyboardArrowRight fontSize="medium" />
      )}
    </IconButton>
  )
}
const CollapseOrderDetails = ({selectedArrows, row}: any) => {
  return (
    <TableCell
      sx={{
        paddingBottom: selectedArrows.includes(row.order) ? '15px' : '0px',
        paddingTop: selectedArrows.includes(row.order) ? '15px' : '0px',
        flexDirection: 'column',
        backgroundColor: '#F6F6F6',
      }}
      align="left"
      colSpan={8}>
      <Collapse
        in={selectedArrows.includes(row.order)}
        timeout="auto"
        unmountOnExit>
        {row.items.map((el: IItem) => (
          <ItemsContainer key={el.id}>
            <ItemLeftContainer>
              <CellText>{el.name}</CellText>
              <CellTextWeak>{el.id}</CellTextWeak>
            </ItemLeftContainer>
            <ItemRightContainer>
              <CellText>{el.quantity}</CellText>
              <CellText>{formatCurrency(el.price)}</CellText>
            </ItemRightContainer>
          </ItemsContainer>
        ))}
      </Collapse>
    </TableCell>
  )
}

const defaultOrder = {
  order: 'desc',
  orderBy: 'date',
}
export default function AdminOrderTable() {
  const router = useRouter()
  // Misc
  const [selected, setSelected] = useState<readonly string[]>([])
  const [selectedArrows, setSelectedArrows] = useState<any[]>([])
  // Sort
  const [order, setOrder] = useState<TOrder>(defaultOrder.order as TOrder)
  const [orderBy, setOrderBy] = useState<string>(defaultOrder.orderBy)
  // Footer
  const [dense, setDense] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rows, setRows] = useState<any[]>([])
  // Filters
  const [startDate, setStartDate] = useState<any>()
  const [endDate, setEndDate] = useState<any>()
  const [search, setSearch] = useState<string>('')
  const [statuses, setStatuses] = useState<string[]>([])
  // Query API
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: [
      'getListOrder',
      {
        order,
        orderBy,
        startDate: startDate ? convertDateToTimestamp(startDate, true) : null,
        endDate: endDate ? convertDateToTimestamp(endDate) : null,
        statuses,
        limit: 100,
      },
    ],
    queryFn: getListOrder,
  })
  useEffect(() => {
    if (data) {
      const formattedRows: any = []
      data?.forEach((item: any) => {
        const customer = {
          name: item.customerName,
          email: item.customerEmail,
          phone: item.customerPhone,
          photoUrl: '',
        }
        const items = item.items.map((el: any) => ({
          id: el.itemId,
          name: el.itemName,
          quantity: el.itemQuantity,
          price: el.itemPrice,
        }))
        formattedRows.push(
          createData(
            item.id,
            customer,
            item.timestamp,
            item.totalQuantity,
            item.totalAmount,
            item.status,
            items,
          ),
        )
      })
      setRows(formattedRows)
    }
  }, [data])

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.order)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
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

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  const visibleRows = React.useMemo(
    () => getVisibleRows(rows, page, rowsPerPage),
    [page, rowsPerPage, rows],
  )

  const onSelectedArrow = (id: string) => {
    if (selectedArrows.includes(id)) {
      setSelectedArrows(selectedArrows.filter((item: string) => item !== id))
    } else {
      selectedArrows.push(id)
      setSelectedArrows([...selectedArrows])
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    const success = await deleteOrder(orderId)
    if (success) {
      refetch()
    } else {
      console.log('some thing went wrong')
    }
  }
  const handleUpdateOrder = async (orderId: string, status: any) => {
    const fields = {status}
    const success = await updateOrder(orderId, fields)
    if (success) {
      refetch()
    } else {
      console.log('some thing went wrong')
    }
  }
  const renderDateCellContent = (timestamp: number) => {
    const {date, time} = formatDateAndTime(timestamp)
    return (
      <Stack>
        <CellText>{date}</CellText>
        <CellTextWeak>{time}</CellTextWeak>
      </Stack>
    )
  }
  const renderCustomerCellContent = (customer: ICustomer) => {
    const {name, email, phone, photoUrl} = customer
    return (
      <Stack>
        <CellText>{name}</CellText>
        <CellTextWeak>{email}</CellTextWeak>
      </Stack>
    )
  }
  return (
    <Paper sx={{width: '100%'}}>
      <TableToolbar
        numSelected={selected.length}
        onRefresh={refetch}
        startDate={startDate}
        endDate={endDate}
        search={search}
        statuses={statuses}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setSearch={setSearch}
        setStatuses={setStatuses}
      />
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
              const isItemSelected = isSelected(row.order as string)
              const labelId = `enhanced-table-checkbox-${index}`

              return (
                <>
                  <TableRow
                    hover
                    onClick={() => {}}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.order}
                    selected={isItemSelected}>
                    <TableCell
                      padding="checkbox"
                      onClick={event =>
                        handleClick(event, row.order as string)
                      }>
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" padding="none" id={labelId}>
                      <CellTextWeak>{row.order}</CellTextWeak>
                    </TableCell>
                    <TableCell align="left">
                      {renderCustomerCellContent(row.customer)}
                    </TableCell>
                    <TableCell align="left">
                      {renderDateCellContent(row.date)}
                    </TableCell>
                    <TableCell align="left">
                      <CellText>{row.quantity}</CellText>
                    </TableCell>
                    <TableCell align="left">
                      <CellText>{formatCurrency(row.total)}</CellText>
                    </TableCell>
                    <TableCell align="left">
                      <StatusOptions
                        id={row.order}
                        label={row.status}
                        onSelect={(status: string) =>
                          handleUpdateOrder(row.order, status)
                        }
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <CollapseArrowButton
                          row={row}
                          selectedArrows={selectedArrows}
                          onSelectedArrow={onSelectedArrow}
                        />
                        <MoreOptions
                          id={row.order}
                          onDelete={() => handleDeleteOrder(row.order)}
                          onView={() =>
                            router.push(`/admin/order/${row.order}`)
                          }
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                  <CollapseOrderDetails
                    row={row}
                    selectedArrows={selectedArrows}
                  />
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

const ItemsContainer = styled(TableCell)`
  display: flex;
  flex-direction: row;
  background-color: white;
  padding: 10px 15px 10px 15px;
`
const ItemLeftContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 80%;
`
const ItemRightContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 20%;
`
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
const Footer = styled(Box)`
  display: flex;
  padding-left: 20px;
  flex-direction: row;
  justify-content: space-between;
`

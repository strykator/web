'use client'

import * as React from 'react'
import styled from 'styled-components'
import {useQuery} from '@tanstack/react-query'
import {alpha} from '@mui/material/styles'
import {
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Paper,
  Tooltip,
  FormControlLabel,
  Switch,
  Checkbox,
  Collapse,
  Menu,
  MenuItem,
  ListItemIcon,
  Chip,
  Popover,
  Stack,
  Divider,
  InputBase,
} from '@mui/material'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import FilterListIcon from '@mui/icons-material/FilterList'
import {
  KeyboardArrowRight,
  KeyboardArrowDown,
  MoreVert,
  DeleteForever,
  Visibility,
  Refresh,
  Search,
  Clear,
} from '@mui/icons-material'
import {visuallyHidden} from '@mui/utils'
import {getListOrder, deleteOrder, updateOrder} from '@/libs/firebase'
import Button from '../Button'
import {
  formatCurrency,
  formatDateAndTime,
  convertDateToTimestamp,
  getOrderStatusChipColor,
} from '@/utils'
import {theme} from '@/theme'

interface IItem {
  id: string
  name: string
  quantity: number
  price: number
}
interface ICustomer {
  name: string
  email: string
  phone: string
  photoUrl: string
}
interface Data {
  order: string
  customer: ICustomer
  date: number
  quantity: number
  total: number
  status: string
  items: IItem[]
  extras: string
}

function createData(
  order: string,
  customer: ICustomer,
  date: number,
  quantity: number,
  total: number,
  status: string,
  items: IItem[],
  extras?: string,
): Data {
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

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
  width: string
}

const headCells: readonly HeadCell[] = [
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

const statusArray = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'refunded',
]
type TStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded'
interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
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
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
  onRefresh: any
  startDate: any
  endDate: any
  search: string
  setStartDate: any
  setEndDate: any
  setSearch: any
  statuses: string[]
  setStatuses: any
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const [showFilter, setShowFilter] = React.useState<boolean>(false)
  const {
    onRefresh,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    search,
    setSearch,
    statuses,
    setStatuses,
  } = props

  const handleSearch = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setSearch(event.target.value)
  }
  const toggleStatus = (status: string) => {
    if (statuses.includes(status)) {
      setStatuses(statuses.filter((el: string) => el !== status))
    } else {
      setStatuses([...statuses, status])
    }
  }
  const handleClearFilter = () => {
    startDate && setStartDate(null)
    endDate && setEndDate(null)
    search && setSearch('')
  }
  return (
    <Stack
      sx={{
        flex: 1,
      }}>
      <Box
        sx={{
          p: 0.8,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Tooltip title="Filter List">
          <IconButton onClick={() => setShowFilter(!showFilter)}>
            <FilterListIcon color={showFilter ? 'info' : 'inherit'} />
          </IconButton>
        </Tooltip>
        <Box
          sx={{
            width: '70%',
            maxWidth: '500px',
            p: 0.5,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          {statusArray.map((status: string) => {
            return (
              <Tooltip key={status} title={`filter ${status} status`}>
                <Chip
                  onClick={() => toggleStatus(status)}
                  label={status}
                  variant={statuses.includes(status) ? 'filled' : 'outlined'}
                  color={getOrderStatusChipColor(status)}
                  size="small"
                />
              </Tooltip>
            )
          })}
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={onRefresh}>
            <Refresh color="info" />
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={showFilter} timeout="auto" unmountOnExit>
        <Divider light />
        <Box
          sx={{
            flex: 1,
            px: 2,
            py: 1,
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F6F6F6',
          }}>
          <Paper
            component="form"
            elevation={3}
            sx={{
              p: '3.5px 2px',
              display: 'flex',
              mr: 2,
              alignItems: 'center',
              width: 400,
            }}>
            <InputBase
              sx={{ml: 1, flex: 1}}
              value={search}
              onChange={handleSearch}
              placeholder="Search for customer name or email"
              inputProps={{'aria-label': 'Search for customer name or email'}}
            />
            <IconButton type="button" sx={{p: '10px'}} aria-label="search">
              <Search />
            </IconButton>
          </Paper>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Paper elevation={1} sx={{my: 2, mr: 2}}>
              <DatePicker
                value={startDate}
                onChange={(newValue: any) => setStartDate(newValue)}
                label="Start Date"
              />
            </Paper>
            <Paper elevation={1} sx={{my: 2}}>
              <DatePicker
                value={endDate}
                onChange={(newValue: any) => setEndDate(newValue)}
                label="End Date"
              />
            </Paper>
          </LocalizationProvider>
          <Tooltip sx={{ml: 2}} title="Clear Filter">
            <IconButton onClick={handleClearFilter}>
              <Clear
                color={search || startDate || endDate ? 'error' : 'inherit'}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider light />
      </Collapse>
    </Stack>
  )
}
type Order = 'asc' | 'desc'

const MoreOptions = ({
  id,
  onDelete,
  onView,
}: {
  id: string
  onDelete: any
  onView: any
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
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
const defaultOrder = {
  order: 'desc',
  orderBy: 'date',
}
export default function TableData() {
  const [order, setOrder] = React.useState<Order>(defaultOrder.order as Order)
  const [orderBy, setOrderBy] = React.useState<keyof Data>(
    defaultOrder.orderBy as keyof Data,
  )
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [rows, setRows] = React.useState<any[]>([])
  const [selectedArrows, setSelectedArrows] = React.useState<any[]>([])
  // Filters
  const [startDate, setStartDate] = React.useState<any>()
  const [endDate, setEndDate] = React.useState<any>()
  const [search, setSearch] = React.useState<string>('')
  const [statuses, setStatuses] = React.useState<string[]>([])
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
  React.useEffect(() => {
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

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0
  const visibleRows = React.useMemo(
    () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows],
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
    <Box sx={{width: '100%'}}>
      <Paper sx={{width: '100%'}}>
        <EnhancedTableToolbar
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
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
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
                          <IconButton
                            onClick={() => onSelectedArrow(row.order)}>
                            {selectedArrows.includes(row.order) ? (
                              <KeyboardArrowDown
                                fontSize="medium"
                                color="info"
                              />
                            ) : (
                              <KeyboardArrowRight fontSize="medium" />
                            )}
                          </IconButton>
                          <MoreOptions
                            id={row.order}
                            onDelete={() => handleDeleteOrder(row.order)}
                            onView={() => console.log('view =>> ', row.order)}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>

                    <TableCell
                      sx={{
                        paddingBottom: selectedArrows.includes(row.order)
                          ? '15px'
                          : '0px',
                        paddingTop: selectedArrows.includes(row.order)
                          ? '15px'
                          : '0px',
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
                  </>
                )
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: 'flex',
            pl: 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense"
          />
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>
    </Box>
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

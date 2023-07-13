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
  Toolbar,
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
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import {
  KeyboardArrowRight,
  KeyboardArrowDown,
  MoreVert,
  DeleteForever,
  Visibility,
} from '@mui/icons-material'
import {visuallyHidden} from '@mui/utils'
import {getListOrder, deleteOrder, updateOrder} from '@/libs/firebase'
import {formatCurrency, formatDateAndTime} from '@/utils'
import {theme} from '@/theme'

interface IItem {
  id: string
  name: string
  quantity: number
  price: number
}
interface Data {
  order: string
  customer: string
  date: number
  quantity: number
  total: number
  status: string
  items: IItem[]
  extras: string
}

function createData(
  order: string,
  customer: string,
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
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {numSelected} = props

  return (
    <Toolbar
      sx={{
        pl: {sm: 2},
        pr: {xs: 1, sm: 1},
        ...(numSelected > 0 && {
          bgcolor: theme =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}>
      {numSelected > 0 && (
        <Typography
          sx={{flex: '1 1 100%'}}
          color="inherit"
          variant="subtitle1"
          component="div">
          {numSelected} selected
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
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

  const options = ['pending', 'confirmed', 'completed', 'cancelled', 'refunded']
  const getChipColor = (status: string) => {
    if (status === 'pending') {
      return 'warning'
    } else if (status === 'confirmed') {
      return 'primary'
    } else if (status === 'completed') {
      return 'success'
    } else if (status === 'cancelled') {
      return 'error'
    } else if (status === 'refunded') {
      return 'default'
    } else {
      return 'default'
    }
  }
  return (
    <>
      <Chip
        label={label}
        onClick={onClick}
        onDelete={onClick}
        deleteIcon={<KeyboardArrowDown />}
        color={getChipColor(label)}
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
          {options.map((option: string) => {
            if (option === label) return null
            return (
              <MenuItem key={option} onClick={() => handleOnSelect(option)}>
                <Chip
                  label={option}
                  color={getChipColor(option)}
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

export default function TableData() {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('customer')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [rows, setRows] = React.useState<any[]>([])
  const [selectedArrows, setSelectedArrows] = React.useState<any[]>([])
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['getListOrder', {order, orderBy}],
    queryFn: getListOrder,
  })
  React.useEffect(() => {
    if (data) {
      const formattedRows: any = []
      data?.forEach((item: any) =>
        formattedRows.push(
          createData(
            item.id,
            item.customerName,
            item.timestamp,
            item.totalQuantity,
            item.totalAmount,
            item.status,
            item.items.map((el: any) => ({
              id: el.itemId,
              name: el.itemName,
              quantity: el.itemQuantity,
              price: el.itemPrice,
            })),
          ),
        ),
      )
      setRows(formattedRows)
    }
  }, [data])

  if (rows.length === 0) return null

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
  return (
    <Box sx={{width: '100%'}}>
      <Paper sx={{width: '100%', mb: 2}}>
        <EnhancedTableToolbar numSelected={selected.length} />
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
              {rows.map((row, index) => {
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
                        {row.order}
                      </TableCell>
                      <TableCell align="left">{row.customer}</TableCell>
                      <TableCell align="left">
                        {formatDateAndTime(row.date)}
                      </TableCell>
                      <TableCell align="left">{row.quantity}</TableCell>
                      <TableCell align="left">
                        {formatCurrency(row.total)}
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
                              <Typography>{el.name}</Typography>
                              <Typography>{el.id}</Typography>
                            </ItemLeftContainer>
                            <ItemRightContainer>
                              <Typography>{el.quantity}</Typography>
                              <Typography>
                                {formatCurrency(el.price)}
                              </Typography>
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense"
      />
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

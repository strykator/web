import React, {useState} from 'react'
import {
  IconButton,
  Box,
  Paper,
  Tooltip,
  Collapse,
  Chip,
  Stack,
  Divider,
  InputBase,
} from '@mui/material'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {Refresh, Search, Clear, FilterList} from '@mui/icons-material'
import {ITableToolbarProps} from './types'
import {statusArray} from './utils'
import {getOrderStatusChipColor} from '@/utils'

export default function TableToolbar({
  numSelected,
  onRefresh,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  search,
  setSearch,
  statuses,
  setStatuses,
}: ITableToolbarProps) {
  const [showFilter, setShowFilter] = useState<boolean>(false)

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
            <FilterList color={showFilter ? 'info' : 'inherit'} />
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
                maxDate={endDate}
              />
            </Paper>
            <Paper elevation={1} sx={{my: 2}}>
              <DatePicker
                value={endDate}
                onChange={(newValue: any) => setEndDate(newValue)}
                label="End Date"
                minDate={startDate}
              />
            </Paper>
          </LocalizationProvider>
          <Tooltip sx={{ml: 1}} title="Clear Filter">
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

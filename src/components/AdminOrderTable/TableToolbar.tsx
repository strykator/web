import React, {useState, useMemo} from 'react'
import styled from 'styled-components'
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
  const activeFilter = useMemo(() => {
    if (startDate || endDate || search) return true
    return false
  }, [startDate, endDate, search])
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
    <Container>
      <Header>
        <Tooltip title="Refresh">
          <IconButton onClick={onRefresh}>
            <RefreshIcon color="info" />
          </IconButton>
        </Tooltip>
        <StatusContainer>
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
        </StatusContainer>
        <Tooltip title={activeFilter ? 'Active Filter List' : 'Filter List'}>
          <IconButton onClick={() => setShowFilter(!showFilter)}>
            <FilterList color={activeFilter ? 'info' : 'inherit'} />
          </IconButton>
        </Tooltip>
      </Header>

      <Collapse in={showFilter} timeout="auto" unmountOnExit>
        <Divider light />
        <FilterInputContainer>
          <SearchBar elevation={3}>
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
          </SearchBar>
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
          {activeFilter && (
            <Tooltip sx={{ml: 1}} title="Clear All Filters">
              <IconButton onClick={handleClearFilter}>
                <Clear color="error" />
              </IconButton>
            </Tooltip>
          )}
        </FilterInputContainer>
        <Divider light />
      </Collapse>
    </Container>
  )
}

const Container = styled(Stack)`
  flex: 1;
`
const Header = styled(Box)`
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const StatusContainer = styled(Box)`
  width: 70%;
  max-width: 500px;
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`
const FilterInputContainer = styled(Box)`
  display: flex;
  flex: 1;
  padding: 3px 5px 3px 5px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #f6f6f6;
`
const SearchBar = styled(Paper)`
  padding: 5px 3px 5px 2px;
  display: flex;
  margin-right: 15px;
  align-items: center;
  width: 370px;
`
const RefreshIcon = styled(Refresh)`
  transition: transform 0.6s ease-in-out;
  &:hover {
    transform: rotate(360deg);
  }
`

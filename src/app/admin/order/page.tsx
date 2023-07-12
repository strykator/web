'use client'

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useRouter, usePathname} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {
  Paper,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Divider,
  Stack,
  Tabs,
  Tab,
} from '@mui/material'
import {theme} from '@/theme'
import {useResponsive} from '@/hooks'
import {RootState} from '@/redux'
import {selectUserUid} from '@/redux/user/userSlice'
import TableData from '@/components/TableData'

export default function OrderList() {
  const router = useRouter()
  const pathName = usePathname()
  const {isMobile} = useResponsive()
  const appState = useSelector((state: RootState) => state)
  const userId = selectUserUid(appState)
  const [selectedStatus, setSelectedStatus] = useState(1)

  function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault()
    console.info('You clicked a breadcrumb.')
  }
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/admin"
      onClick={handleClick}>
      Admin
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href="/admin/order"
      onClick={handleClick}>
      Order
    </Link>,
    <Typography key="3" color="text.primary">
      List
    </Typography>,
  ]
  const onChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedStatus(newValue)
  }
  return (
    <Container>
      <Title>Order List</Title>
      <Stack spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
      <Body elevation={1}>
        <BodyTop>
          <Box sx={{width: '100%', bgcolor: 'background.paper'}}>
            <Tabs
              value={selectedStatus}
              onChange={onChangeTab}
              centered
              variant="scrollable"
              scrollButtons="auto">
              <Tab
                icon={<Text>{selectedStatus}</Text>}
                iconPosition="end"
                label="All"
                disableRipple
              />
              <Tab
                icon={<Text>{selectedStatus}</Text>}
                iconPosition="end"
                label="Pending"
                disableRipple
              />
              <Tab
                icon={<Text>{selectedStatus}</Text>}
                iconPosition="end"
                label="Confirmed"
                disableRipple
              />
              <Tab
                icon={<Text>{selectedStatus}</Text>}
                iconPosition="end"
                label="Completed"
                disableRipple
              />
              <Tab
                icon={<Text>{selectedStatus}</Text>}
                iconPosition="end"
                label="Cancelled"
                disableRipple
              />
              <Tab
                icon={<Text>{selectedStatus}</Text>}
                iconPosition="end"
                label="Refunded"
                disableRipple
              />
            </Tabs>
          </Box>
        </BodyTop>
        <Divider />
        <FilterContainer></FilterContainer>
        <Divider />
        <TableContainer>
          <TableData />
        </TableContainer>
      </Body>
    </Container>
  )
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
`
const Title = styled(Typography)`
  color: ${theme.color.text};
  font-size: ${theme.font.size.xl};
  font-family: ${theme.font.family};
  font-weight: 500;
`
const Body = styled(Paper)`
  display: flex;
  margin-top: 40px;
  flex-direction: column;
`
const BodyTop = styled(Box)`
  display: flex;
  align-items: 'center';
  width: 100%;
  padding: 5px 15px 5px 15px;
  box-sizing: border-box;
`
const FilterContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: 60px;
  padding-left: 15px;
  box-sizing: border-box;
`
const TableContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: 250px;
`
const Text = styled(Typography)`
  color: ${theme.color.text};
  font-size: ${theme.font.size.m};
  font-family: ${theme.font.family};
  font-weight: 400;
`

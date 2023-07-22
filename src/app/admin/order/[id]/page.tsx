'use client'

import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {useRouter} from 'next/navigation'
import {useQuery} from '@tanstack/react-query'
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
  Chip,
  IconButton,
} from '@mui/material'
import {ArrowBack} from '@mui/icons-material'
import {theme} from '@/theme'
import {useResponsive} from '@/hooks'
import Button from '@/components/Button'
import {getOrderById} from '@/libs/firebase'
import {getOrderStatusChipColor, formatCurrency} from '@/utils'

export default function Page({params}: {params: {id: string}}) {
  const orderId = params.id
  const router = useRouter()
  // Query API
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: [
      'getOrderById',
      {
        orderId,
      },
    ],
    queryFn: getOrderById,
  })

  const subtotal = data?.totalAmount - data?.tip - data?.taxes - data?.discount

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <IconButton onClick={() => router.back()}>
            <ArrowBack />
          </IconButton>
          <Stack mx={0.7}>
            <Title>Order {orderId}</Title>
            <TextWeak>22 Jul 2023 11:57 AM</TextWeak>
          </Stack>
          <Chip
            label={data?.status}
            color={getOrderStatusChipColor(data?.status)}
            variant="filled"
            size="small"
          />
        </HeaderLeft>
      </Header>

      <Body>
        <BodyLeft>
          <Title>Details</Title>
          {data?.items?.map((el: any) => (
            <Box key={el.itemName}>
              <ItemContainer>
                <Text>{el.itemName}</Text>
                <RowItem>
                  <Text>{el.itemQuantity}</Text>
                  <Text>{formatCurrency(el.itemPrice)}</Text>
                </RowItem>
              </ItemContainer>
              <Divider light />
            </Box>
          ))}
          <BodyLeftFooter>
            <Row>
              <Text>Subtotal</Text>
              <Text>{formatCurrency(subtotal ?? 0)}</Text>
            </Row>
            <Row>
              <Text>Discount</Text>
              <Text>{formatCurrency(data?.discount ?? 0)}</Text>
            </Row>
            <Row>
              <Text>Taxes</Text>
              <Text>{formatCurrency(data?.taxes ?? 0)}</Text>
            </Row>
            <Row>
              <Text>Tip</Text>
              <Text>{formatCurrency(data?.tip ?? 0)}</Text>
            </Row>
            <Row>
              <Title>Total</Title>
              <Title>{formatCurrency(data?.totalAmount ?? 0)}</Title>
            </Row>
          </BodyLeftFooter>
        </BodyLeft>
        <BodyRight></BodyRight>
      </Body>
    </Container>
  )
}
const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`
const Header = styled(Box)`
  display: flex;
  width: 100%;
`
const HeaderLeft = styled(Box)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 80%;
  height: 60px;
`
const Text = styled(Typography)`
  font-size: ${theme.font.size.s};
  color: ${theme.color.text};
  font-weight: 300;
`
const TextWeak = styled(Typography)`
  font-size: ${theme.font.size.s};
  color: ${theme.color.textWeak};
  font-weight: 200;
`
const Title = styled(Typography)`
  font-size: ${theme.font.size.l};
  color: ${theme.color.text};
  font-weight: 500;
`
const Body = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
`
const BodyLeft = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 10px 15px 10px 15px;
  width: 65%;
  min-height: 40vh;
  box-sizing: border-box;
`
const BodyRight = styled(Paper)`
  display: flex;
  flex-direction: row;
  width: 33%;
  min-height: 40vh;
  background-color: burlywood;
`
const Row = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const ItemContainer = styled(Row)`
  padding: 10px 0px 10px 0px;
`
const RowItem = styled(Row)`
  width: 30%;
`
const BodyLeftFooter = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 50%;
  align-self: flex-end;
  margin-top: 20px;
  margin-bottom: 15px;
`

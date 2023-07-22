'use client'

import React from 'react'
import styled from 'styled-components'
import {useRouter} from 'next/navigation'
import {useQuery} from '@tanstack/react-query'
import {
  Paper,
  Box,
  Typography,
  Divider,
  Stack,
  Chip,
  IconButton,
} from '@mui/material'
import {ArrowBack} from '@mui/icons-material'
import {theme} from '@/theme'
import {useResponsive} from '@/hooks'
import {getOrderById} from '@/libs/firebase'
import {
  getOrderStatusChipColor,
  formatCurrency,
  formatDateAndTime,
  formatAddress,
  formatPhoneInput,
} from '@/utils'

export default function Page({params}: {params: {id: string}}) {
  const orderId = params.id
  const router = useRouter()
  const {isMobile} = useResponsive()
  // Query API
  const {data, isLoading, error} = useQuery({
    queryKey: [
      'getOrderById',
      {
        orderId,
      },
    ],
    queryFn: getOrderById,
  })
  if (!data?.customerEmail) {
    return null
  }
  // const data = {
  //   customerEmail: 'veronica@test.com',
  //   customerName: 'Veronica',
  //   customerPhone: '4567891665',
  //   discount: 0,
  //   entityId: 'Chick-fil-A',
  //   items: [
  //     {
  //       itemId: 'key1689694142572',
  //       itemName: 'Chick-fil-A® Nuggets Meal',
  //       itemOptions: [],
  //       itemPrice: 11.65,
  //       itemQuantity: 3,
  //     },
  //     {
  //       itemId: 'key1689694142572',
  //       itemName: 'Chick-fil-A® Nuggets Meal',
  //       itemOptions: [],
  //       itemPrice: 11.65,
  //       itemQuantity: 3,
  //     },
  //     {
  //       itemId: 'key1689694142572',
  //       itemName: 'Chick-fil-A® Nuggets Meal',
  //       itemOptions: [],
  //       itemPrice: 11.65,
  //       itemQuantity: 3,
  //     },
  //   ],
  //   paymentMethod: 'cash',
  //   promoCode: '',
  //   shippingAddress: {
  //     city: 'Herndon',
  //     country: 'USA',
  //     state: 'VA',
  //     street: '698 Elden Street',
  //     zipcode: '20170',
  //   },
  //   status: 'confirmed',
  //   taxes: 10.4,
  //   timestamp: 1689694182197,
  //   tip: 20.8,
  //   totalAmount: 135.2,
  //   totalQuantity: 8,
  // }
  const subtotal = data?.totalAmount - data?.tip - data?.taxes - data?.discount
  const {date, time} = formatDateAndTime(data?.timestamp)
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <IconButton onClick={() => router.back()}>
            <ArrowBack />
          </IconButton>
          <Stack mx={0.7}>
            <Title>Order {orderId}</Title>
            <TextWeak>{`${date} ${time}`}</TextWeak>
          </Stack>
          <Chip
            label={data?.status}
            color={getOrderStatusChipColor(data?.status)}
            variant="filled"
            size="small"
          />
        </HeaderLeft>
      </Header>

      <Body isMobile={isMobile}>
        <BodyLeft isMobile={isMobile}>
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

        <BodyRight isMobile={isMobile}>
          <Title>Customer</Title>
          <InfoContainer>
            <Row>
              <Text>Name</Text>
              <Text>{data?.customerName}</Text>
            </Row>
            <Row>
              <Text>Email</Text>
              <Text>{data?.customerEmail}</Text>
            </Row>
            <Row>
              <Text>Phone</Text>
              <Text>{formatPhoneInput(data?.customerPhone)}</Text>
            </Row>
          </InfoContainer>
          <InfoDivider light />

          <Title>Shipping</Title>
          <InfoContainer>
            <Text>{formatAddress(data?.shippingAddress)}</Text>
          </InfoContainer>
          <InfoDivider light />

          <Title>Payment</Title>
          <InfoContainer>
            <Row>
              <Text>Payment Method</Text>
              <Text>{data?.paymentMethod}</Text>
            </Row>
          </InfoContainer>
        </BodyRight>
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
const Body = styled(Box)<{isMobile: boolean}>`
  display: flex;
  flex-direction: ${({isMobile}) => (isMobile ? 'column' : 'row')};
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
`
const BodyLeft = styled(Paper)<{isMobile: boolean}>`
  display: flex;
  flex-direction: column;
  padding: 10px 15px 10px 15px;
  width: ${({isMobile}) => (isMobile ? '100%' : '65%')};
  min-width: 300px;
  min-height: 40vh;
  box-sizing: border-box;
`
const BodyRight = styled(Paper)<{isMobile: boolean}>`
  display: flex;
  flex-direction: column;
  padding: 10px 15px 10px 15px;
  width: ${({isMobile}) => (isMobile ? '100%' : '33%')};
  min-height: 40vh;
  min-width: ${({isMobile}) => (isMobile ? '300px' : '150px')};
  box-sizing: border-box;
  margin-top: ${({isMobile}) => (isMobile ? '20px' : '0px')};
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
  min-width: 80px;
`
const BodyLeftFooter = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 50%;
  align-self: flex-end;
  margin-top: 20px;
  margin-bottom: 15px;
`
const InfoContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
`
const InfoDivider = styled(Divider)`
  margin: 10px 0px 10px 0px;
`

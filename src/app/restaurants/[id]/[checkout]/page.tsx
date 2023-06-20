'use client'

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {
  Grid,
  Paper,
  Box,
  Typography,
  Link,
  IconButton,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  Stack,
  Tabs,
  Tab,
  Divider,
  Backdrop,
  CircularProgress,
} from '@mui/material'
import {
  ArrowBack,
  ExpandMore,
  CheckRounded,
  PriorityHighRounded,
} from '@mui/icons-material'
import {useRouter, useSearchParams} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '@/redux'
import {
  selectEntityId,
  selectTotalPrice,
  selectTotalQuantity,
  emptyCart,
} from '@/redux/cart/cartSlice'
import Button from '@/components/Button'
import Image from '@/components/Image'
import ShoppingCart from '@/components/ShoppingCart'
import {theme} from '@/theme'
import {useResponsive} from '@/hooks'
import {getRestaurantById, formatCurrency} from '@/utils'

const fieldIds = {
  name: 'name-outlined-basic',
  email: 'email-outlined-basic',
  phone: 'phone-outlined-basic',
  address: 'address-outlined-basic',
  country: 'country-outlined-basic',
  state: 'state-outlined-basic',
  city: 'city-outlined-basic',
  zipcode: 'zipcode-outlined-basic',
  cardNumber: 'cardNumber-outlined-basic',
  expiration: 'expiration-outlined-basic',
  cardCode: 'cardCode-outlined-basic',
  promoteCode: 'promoteCode-outlined-basic',
}

export default function Checkout({params}: {params: {checkout: string}}) {
  const router = useRouter()
  const {isMobile, isTablet} = useResponsive()
  const checkout = params.checkout
  const searchParams = useSearchParams()
  const appState = useSelector((state: RootState) => state)
  const dispatch = useDispatch()
  const restaurantId = selectEntityId(appState)
  const restaurant = getRestaurantById(restaurantId)
  const subTotal = selectTotalPrice(appState)
  const totalQuantity = selectTotalQuantity(appState)
  const [expanded, setExpanded] = React.useState<string | false>('panel2')
  const [value, setValue] = React.useState(0)
  const [tip, setTip] = React.useState(0)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [country, setCountry] = useState<string>('')
  const [state, setState] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [zipcode, setZipcode] = useState<string>('')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [cardCode, setCardCode] = useState<string>('')
  const [expiration, setExpiration] = useState<string>('')
  const [promoteCode, setPromoteCode] = useState<string>('')
  const [open, setOpen] = React.useState(false)

  const onLoadingClose = () => setOpen(false)
  const openLoadingSreen = () => setOpen(true)

  const onChangeAccordion =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }
  const onChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  useEffect(() => {
    let tipFloat = 0.0
    switch (value) {
      case 0:
        tipFloat = subTotal * 0
        break
      case 1:
        tipFloat = subTotal * 0.1
        break
      case 2:
        tipFloat = subTotal * 0.15
        break
      case 3:
        tipFloat = subTotal * 0.2
        break
      default:
        break
    }
    setTip(parseFloat(tipFloat.toFixed(2)))
  }, [value, subTotal])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.id) {
      case fieldIds['name']:
        setName(event.target.value)
        break
      case fieldIds['email']:
        setEmail(event.target.value)
        break
      case fieldIds['phone']:
        setPhone(event.target.value)
        break
      case fieldIds['address']:
        setAddress(event.target.value)
        break
      case fieldIds['country']:
        setCountry(event.target.value)
        break
      case fieldIds['state']:
        setState(event.target.value)
        break
      case fieldIds['city']:
        setCity(event.target.value)
        break
      case fieldIds['zipcode']:
        setZipcode(event.target.value)
        break
      case fieldIds['cardNumber']:
        setCardNumber(event.target.value)
        break
      case fieldIds['expiration']:
        setExpiration(event.target.value)
        break
      case fieldIds['cardCode']:
        setCardCode(event.target.value)
        break
      case fieldIds['promoteCode']:
        setPromoteCode(event.target.value)
        break
      default:
        break
    }
  }
  const handlePlaceOrder = () => {
    openLoadingSreen()
    alert(
      `Your order includes ${totalQuantity} items with total ${formatCurrency(
        subTotal + subTotal * 0.1 + tip,
      )}`,
    )
    router.replace('/')
    dispatch(emptyCart())
  }

  const renderInputFields = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <SectionText>Account Details</SectionText>
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          id="name-outlined-basic"
          label="Name"
          variant="outlined"
          defaultValue={name}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          id="email-outlined-basic"
          label="Email"
          variant="outlined"
          defaultValue={email}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          id="phone-outlined-basic"
          label="Phone Number"
          variant="outlined"
          defaultValue={phone}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <SectionText>Shipping Details</SectionText>
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          id="address-outlined-basic"
          label="Address"
          variant="outlined"
          defaultValue={address}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          id="country-outlined-basic"
          label="Country"
          variant="outlined"
          defaultValue={country}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          id="state-outlined-basic"
          label="State/Region"
          variant="outlined"
          defaultValue={state}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          id="city-outlined-basic"
          label="City"
          variant="outlined"
          defaultValue={city}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          id="zipcode-outlined-basic"
          label="Zip Code"
          variant="outlined"
          defaultValue={zipcode}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <SectionText>Payment Details</SectionText>
      </Grid>
      <Grid item xs={12} md={12}>
        <CustomTextField
          id="cardNumber-outlined-basic"
          label="Card Number"
          variant="outlined"
          defaultValue={cardNumber}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          id="expiration-outlined-basic"
          label="Expiration Date"
          variant="outlined"
          defaultValue={expiration}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          id="cardCode-outlined-basic"
          label="Security Code"
          variant="outlined"
          defaultValue={cardCode}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  )

  // TODO: handle this
  const readyToPlaceOrder = name

  const renderBackDrop = () => {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: theme => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
        }}
        open={open}
        onClick={onLoadingClose}>
        <Stack spacing={2} display={'flex'} alignItems={'center'}>
          <SuccessText>Order placed successfully!</SuccessText>
          <SuccessText>Navigating back to home...</SuccessText>
          <CircularProgress color="inherit" />
        </Stack>
      </Backdrop>
    )
  }

  return (
    <>
      {renderBackDrop()}
      <TopBar>
        <IconButton onClick={() => router.back()}>
          <GoBackIcon />
          <SubTitle>Back</SubTitle>
        </IconButton>
      </TopBar>
      <Container isMobile={isMobile}>
        <Header variant="outlined">
          <Grid container spacing={2}>
            <Grid item xs={3} md={2}>
              <LeftHeader>
                <Image
                  src={restaurant?.logoUrl}
                  alt="logo"
                  type="contain"
                  circle
                  height={80}
                  width={80}
                />
              </LeftHeader>
            </Grid>
            <Grid item xs={9} md={6}>
              <MiddleHeader>
                <Title href={`/restaurants/${restaurantId}`}>
                  {restaurant?.name}
                </Title>
                <SubTitle>{restaurant?.address}</SubTitle>
              </MiddleHeader>
            </Grid>
            {isMobile && (
              <Grid item xs={12}>
                <Box p={1}>
                  <Button
                    title="Place Order"
                    onClick={handlePlaceOrder}
                    width="100%"
                    disabled={Boolean(!readyToPlaceOrder)}
                  />
                </Box>
              </Grid>
            )}
            <Grid item xs={12} md={4}>
              <RightHeader>
                <Row>
                  <PriceTitleWeak>Subtotal</PriceTitleWeak>
                  <Price>{formatCurrency(subTotal)}</Price>
                </Row>
                <Row>
                  <PriceTitleWeak>Tax</PriceTitleWeak>
                  <Price>{formatCurrency(subTotal * 0.1)}</Price>
                </Row>
                <Row>
                  <PriceTitleWeak>Tip</PriceTitleWeak>
                  <Price>{formatCurrency(tip)}</Price>
                </Row>
                <Row>
                  <PriceTitle>Total</PriceTitle>
                  <PriceTitle>
                    {formatCurrency(subTotal + subTotal * 0.1 + tip)}
                  </PriceTitle>
                </Row>
              </RightHeader>
            </Grid>
          </Grid>
        </Header>

        <Options
          expanded={expanded === 'panel1'}
          onChange={onChangeAccordion('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1bh-content"
            id="panel1bh-header">
            <Box
              width={'100%'}
              display={'flex'}
              justifyContent={'space-between'}>
              <Typography sx={{width: '50%', flexShrink: 0}}>
                Options
              </Typography>
              {<CheckRounded style={{color: 'green'}} />}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <CustomTextField
                id="promoteCode-outlined-basic"
                label="Promote Code"
                variant="filled"
                defaultValue={promoteCode}
                onChange={handleChange}
              />
              <Divider />
              <Box sx={{width: '100%', bgcolor: 'background.paper'}}>
                <Tabs value={value} onChange={onChangeTab} centered>
                  <Tab
                    icon={<SubTitle>{formatCurrency(0)}</SubTitle>}
                    iconPosition="bottom"
                    label="0%"
                  />
                  <Tab
                    icon={<SubTitle>{formatCurrency(subTotal * 0.1)}</SubTitle>}
                    iconPosition="bottom"
                    label="10%"
                  />
                  <Tab
                    icon={
                      <SubTitle>{formatCurrency(subTotal * 0.15)}</SubTitle>
                    }
                    iconPosition="bottom"
                    label="15%"
                  />
                  <Tab
                    icon={<SubTitle>{formatCurrency(subTotal * 0.2)}</SubTitle>}
                    iconPosition="bottom"
                    label="20%"
                  />
                </Tabs>
              </Box>
            </Stack>
          </AccordionDetails>
        </Options>

        <PersonalDetails
          expanded={expanded === 'panel2'}
          onChange={onChangeAccordion('panel2')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2bh-content"
            id="panel2bh-header">
            <Box
              width={'100%'}
              display={'flex'}
              justifyContent={'space-between'}>
              <Typography sx={{width: '50%', flexShrink: 0}}>
                Personal Details
              </Typography>
              {readyToPlaceOrder ? (
                <CheckRounded style={{color: 'green'}} />
              ) : (
                <PriorityHighRounded style={{color: 'red'}} />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>{renderInputFields()}</AccordionDetails>
        </PersonalDetails>

        <OrderDetails
          expanded={expanded === 'panel3'}
          onChange={onChangeAccordion('panel3')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel3bh-content"
            id="panel3bh-header">
            <Box
              width={'100%'}
              display={'flex'}
              justifyContent={'space-between'}>
              <Typography sx={{width: '50%', flexShrink: 0}}>
                Your Order {`(${totalQuantity})`}
              </Typography>
              <CheckRounded style={{color: 'green'}} />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <ShoppingCart horizontal />
          </AccordionDetails>
        </OrderDetails>

        <Footer>
          {!isMobile && (
            <Button
              title="Place Order"
              onClick={handlePlaceOrder}
              width="100%"
              disabled={Boolean(!readyToPlaceOrder)}
            />
          )}
        </Footer>
      </Container>
    </>
  )
}

const Container = styled(Box)<{isMobile: boolean}>`
  display: flex;
  flex-direction: column;
  padding-right: ${({isMobile}) => (isMobile ? '2%' : '25%')};
  padding-left: ${({isMobile}) => (isMobile ? '2%' : '25%')};
  box-sizing: border-box;
`
const TopBar = styled(Box)`
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 2;
  height: 60px;
  width: 100%;
  padding-left: 5%;
  background-color: ${theme.color.background};
  box-sizing: border-box;
`
const GoBackIcon = styled(ArrowBack)`
  color: ${theme.color.primaryDark};
  margin-right: 5px;
`
const Title = styled(Link)`
  font-weight: 500;
  font-size: ${theme.font.size.m};
  color: ${theme.color.text};
  text-decoration-color: transparent;
  &:hover {
    text-decoration-color: ${theme.color.primaryDark};
  }
`
const SubTitle = styled(Typography)`
  font-weight: 400;
  font-size: ${theme.font.size.s};
  color: ${theme.color.textWeak};
`
const PriceTitle = styled(Typography)`
  font-weight: 600;
  font-size: ${theme.font.size.m};
  color: ${theme.color.text};
`
const PriceTitleWeak = styled(Typography)`
  font-weight: 400;
  font-size: ${theme.font.size.s};
  color: ${theme.color.text};
`
const Price = styled(Typography)`
  font-weight: 400;
  font-size: ${theme.font.size.s};
  color: ${theme.color.text};
`
const Header = styled(Paper)`
  display: flex;
  flex-direction: row;
  min-height: 100px;
  width: 100%;
  top: 60px;
  z-index: 2;
  position: sticky;
`
const LeftHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  min-height: 100px;
  min-width: 100px;
`
const MiddleHeader = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 100%;
  width: 100%;
`
const RightHeader = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`
const Options = styled(Accordion)`
  margin-top: 10px;
`
const PersonalDetails = styled(Accordion)`
  margin-top: 10px;
`
const OrderDetails = styled(Accordion)`
  margin-top: 10px;
`
const Footer = styled(Box)`
  display: flex;
  width: 100%;
  min-height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 20px;
  margin-bottom: 20px;
`
const Row = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const CustomTextField = styled(TextField)`
  display: flex;
  width: 100%;
  border-radius: 5px;
  & .MuiInputBase-root {
    height: 50px;
    font-size: ${theme.font.size.m};
  }
`
const SectionText = styled(Typography)`
  font-weight: 600;
  font-size: ${theme.font.size.l};
  color: ${theme.color.text};
`
const SuccessText = styled(Typography)`
  font-weight: 400;
  font-size: ${theme.font.size.l};
  color: ${theme.color.background};
`

'use client'

import React, {useState, useEffect, useMemo} from 'react'
import styled from 'styled-components'
import {
  Grid,
  Paper,
  Box,
  Typography,
  Link,
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
  Autocomplete,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material'
import {
  ExpandMore,
  CheckRounded,
  PriorityHighRounded,
} from '@mui/icons-material'
import {useRouter, useSearchParams} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {useForm, Controller, SubmitHandler} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
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
import ErrorMessage from '@/components/ErrorMessage'
import MenuBar from '@/components/MenuBar'
import {theme} from '@/theme'
import {useResponsive} from '@/hooks'
import {
  getRestaurantById,
  formatCurrency,
  formatPhoneInput,
  formatVisaCardNumber,
  formatExpirationDate,
  schemaFormCheckout,
} from '@/utils'
import {
  fetchPlaceAutocomplete,
  fetchZipcode,
  TPlaceAutocomplete,
} from '@/api/rest'
import {createOrder} from '@/libs/firebase'
import {calTaxes, calTotal, prepareOrderPayload} from './utils'
export interface IFormInput {
  name: string
  email: string
  phone: string
  address: string
  country: string
  state: string
  city: string
  zipcode: string
  paymentType: string
  cardNumber: string
  expiration: string
  cardCode: string
  promoCode: string
}

enum Status {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  LOADING = 'loading',
}

export default function Checkout({params}: {params: {checkout: string}}) {
  const router = useRouter()
  const {isMobile, isTablet} = useResponsive()
  const checkout = params.checkout
  const searchParams = useSearchParams()
  const appState = useSelector((state: RootState) => state)
  const userProfile = useSelector((state: RootState) => state.user)
  const shoppingCart = useSelector((state: RootState) => state.cart)
  const dispatch = useDispatch()
  const restaurantId = selectEntityId(appState)
  const restaurant = getRestaurantById(restaurantId)
  const subTotal = selectTotalPrice(appState)
  const totalQuantity = selectTotalQuantity(appState)
  const [expanded, setExpanded] = React.useState<string | false>('panel2')
  const [value, setValue] = useState<number>(0)
  const [tip, setTip] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [open, setOpen] = useState<boolean>(false)
  const [options, setOptions] = useState<string[]>([])
  const [predictions, setPredictions] = useState<TPlaceAutocomplete[]>([])
  const [paymentType, setPaymentType] = useState<string>('cash')
  const [orderConfirmation, setOrderConfirmation] = useState<string>('')
  const [status, setStatus] = useState<Status>(Status.PENDING)
  const defaultFormValues = useMemo(
    () => ({
      name: userProfile.firstName
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : '',
      email: userProfile.email,
      phone: userProfile.phone,
      address: userProfile.address?.street ?? '',
      country: userProfile.address?.country ?? '',
      state: userProfile.address?.state ?? '',
      city: userProfile.address?.city ?? '',
      zipcode: userProfile.address?.zipcode ?? '',
      paymentType: 'cash',
      cardNumber: '',
      expiration: '',
      cardCode: '',
      promoCode: '',
    }),
    [userProfile],
  )
  const {
    control,
    trigger,
    clearErrors,
    setError,
    handleSubmit,
    getValues,
    setValue: setFormValue,
    formState: {errors},
  } = useForm<IFormInput>({
    defaultValues: defaultFormValues,
    //resolver: yupResolver(schemaFormCheckout),
  })
  const {name} = getValues()
  const closeLoadingScreen = () => setOpen(false)
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

  useEffect(() => {
    const {name, email, phone, address, country, state, city, zipcode} =
      getValues()
    if (!name)
      setFormValue(
        'name',
        userProfile.firstName
          ? `${userProfile.firstName} ${userProfile.lastName}`
          : '',
      )
    if (!email) setFormValue('email', userProfile.email ?? '')
    if (!phone) setFormValue('phone', userProfile.phone ?? '')
    if (!address) setFormValue('address', userProfile.address?.street ?? '')
    if (!country) setFormValue('country', userProfile.address?.country ?? '')
    if (!state) setFormValue('state', userProfile.address?.state ?? '')
    if (!city) setFormValue('city', userProfile.address?.city ?? '')
    if (!zipcode) setFormValue('zipcode', userProfile.address?.zipcode ?? '')
  }, [userProfile])

  const handlePlaceOrder: SubmitHandler<IFormInput> = async data => {
    openLoadingSreen()
    const payload = prepareOrderPayload({data, shoppingCart, tip, discount})
    const confirmation = await createOrder(payload)
    // const confirmation =
    //   Math.round(Math.random() * 1000).toString() +
    //   'PiddRS5TyHp' +
    //   Math.round(Math.random() * 1000).toString()
    if (confirmation) {
      setStatus(Status.SUCCESS)
      setOrderConfirmation(confirmation)
      dispatch(emptyCart())
      return
    }
    closeLoadingScreen()
    setStatus(Status.FAILED)
    setTimeout(() => {
      setStatus(Status.PENDING)
    }, 3000)
  }

  const fetchOptions = async (inputValue: string) => {
    if (!inputValue) return
    const result = await fetchPlaceAutocomplete(inputValue)
    const formattedOption = result?.length
      ? result.map((el: TPlaceAutocomplete) => el.fullAddress)
      : []
    setOptions(formattedOption)
    setPredictions(result)
  }

  const renderPaymentType = () => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selected = (event.target as HTMLInputElement).value
      setPaymentType(selected)
      setFormValue('paymentType', selected)
    }
    return (
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={paymentType}
          onChange={handleChange}>
          <FormControlLabel
            value="cash"
            control={<Radio />}
            label="Cash on Deliver"
          />
          <FormControlLabel
            value="card"
            control={<Radio />}
            label="Credit or Debit Card"
          />
        </RadioGroup>
      </FormControl>
    )
  }

  const renderInputFields = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <SectionText>Account Details</SectionText>
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="name"
          control={control}
          render={({field}) => (
            <CustomTextField
              {...field}
              onBlur={() => trigger('name')}
              variant="outlined"
              label="Name*"
              error={!!errors.name}
            />
          )}
          rules={{
            required: 'Name is required',
          }}
        />
        {errors.name && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="email"
          control={control}
          render={({field}) => (
            <CustomTextField
              {...field}
              variant="outlined"
              label="Email"
              error={!!errors.email}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="phone"
          control={control}
          render={({field}) => (
            <CustomTextField
              {...field}
              value={formatPhoneInput(field.value)}
              onChange={e =>
                field.onChange(
                  e.target.value.length <= 12 ? e.target.value : field.value,
                )
              }
              variant="outlined"
              label="Phone Number"
              error={!!errors.phone}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <SectionText>Shipping Details</SectionText>
      </Grid>
      <Grid item xs={12} md={12}>
        <Controller
          name="address"
          control={control}
          render={({field}) => (
            <CustomAutocomplete
              {...field}
              filterOptions={x => x}
              options={options}
              noOptionsText="No locations"
              autoComplete
              includeInputInList
              filterSelectedOptions
              renderInput={params => {
                return <TextField {...params} label="Address" fullWidth />
              }}
              onInputChange={async (event, newInputValue) => {
                field.onChange(newInputValue)
                if (newInputValue && newInputValue.trim() !== '') {
                  await fetchOptions(newInputValue)
                }
              }}
              onChange={async (event: any, newValue: any) => {
                const selected = predictions.filter(
                  (el: any) => el.fullAddress === newValue,
                )[0]
                const zipcode = await fetchZipcode(selected?.placeId ?? '')
                setFormValue('address', selected?.street ?? '')
                setFormValue('city', selected?.city ?? '')
                setFormValue('state', selected?.state ?? '')
                setFormValue('country', selected?.country ?? '')
                setFormValue('zipcode', zipcode ?? '')
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="city"
          control={control}
          render={({field}) => (
            <CustomTextField
              {...field}
              variant="outlined"
              label="City"
              error={!!errors.city}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="state"
          control={control}
          render={({field}) => (
            <CustomTextField
              {...field}
              variant="outlined"
              label="State/Region"
              error={!!errors.state}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="country"
          control={control}
          render={({field}) => (
            <CustomTextField
              {...field}
              variant="outlined"
              label="Country"
              error={!!errors.country}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="zipcode"
          control={control}
          render={({field}) => (
            <CustomTextField
              {...field}
              variant="outlined"
              label="Zip Code"
              error={!!errors.zipcode}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <SectionText>Payment Details</SectionText>
      </Grid>
      <Grid item xs={12} md={12}>
        {renderPaymentType()}
      </Grid>
      {paymentType === 'card' && (
        <>
          <Grid item xs={12} md={12}>
            <Controller
              name="cardNumber"
              control={control}
              render={({field}) => (
                <CustomTextField
                  {...field}
                  variant="outlined"
                  label="Card Number"
                  value={formatVisaCardNumber(field.value)}
                  onChange={e =>
                    field.onChange(
                      e.target.value.length <= 19
                        ? e.target.value
                        : field.value,
                    )
                  }
                  error={!!errors.cardNumber}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="expiration"
              control={control}
              render={({field}) => (
                <CustomTextField
                  {...field}
                  variant="outlined"
                  label="Expiration Date"
                  placeholder="MM/YY"
                  value={formatExpirationDate(field.value)}
                  onChange={e =>
                    field.onChange(
                      e.target.value.length <= 5 ? e.target.value : field.value,
                    )
                  }
                  error={!!errors.expiration}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="cardCode"
              control={control}
              render={({field}) => (
                <CustomTextField
                  {...field}
                  variant="outlined"
                  label="CVV"
                  error={!!errors.cardCode}
                />
              )}
            />
          </Grid>
        </>
      )}
    </Grid>
  )

  // TODO: handle this
  const readyToPlaceOrder = name

  const goHome = () => {
    setStatus(Status.LOADING)
    router.replace('/')
  }

  const renderBackDrop = () => {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: theme => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
        }}
        open={open}>
        <Stack spacing={2} display={'flex'} alignItems={'center'}>
          {orderConfirmation ? (
            <>
              <SuccessText>Order placed successfully!</SuccessText>
              <SuccessText>Your confirmation below:</SuccessText>
              <SuccessText>#{orderConfirmation}</SuccessText>
              <Button
                title="Return Home"
                type="outlined"
                titleColor={theme.color.background}
                borderColor={theme.color.background}
                onClick={goHome}
                width="50%"
                disabled={Boolean(!orderConfirmation)}
                loading={status === Status.LOADING}
              />
            </>
          ) : (
            <CircularProgress color="inherit" />
          )}
        </Stack>
      </Backdrop>
    )
  }

  const renderPlaceOrderButton = () => {
    const placeOrderTitle =
      status === Status.FAILED ? 'Try again later' : 'Place Order'
    return (
      <Button
        title={placeOrderTitle}
        onClick={handleSubmit(handlePlaceOrder)}
        width="100%"
        disabled={Boolean(!readyToPlaceOrder)}
        backgroundColor={
          status === Status.FAILED ? theme.color.error : undefined
        }
      />
    )
  }

  return (
    <>
      {renderBackDrop()}
      <MenuBar
        sticky
        textColor={theme.color.primaryDark}
        bgColor={theme.color.background}
        showBackIcon
      />
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
                <Box pl={1} pr={1}>
                  {renderPlaceOrderButton()}
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
                  <Price>{formatCurrency(calTaxes(subTotal, discount))}</Price>
                </Row>
                <Row>
                  <PriceTitleWeak>Tip</PriceTitleWeak>
                  <Price>{formatCurrency(tip)}</Price>
                </Row>
                <Row>
                  <PriceTitle>Total</PriceTitle>
                  <PriceTitle>
                    {formatCurrency(calTotal(subTotal, tip, discount))}
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
              <Controller
                name="promoCode"
                control={control}
                render={({field}) => (
                  <CustomTextField
                    {...field}
                    variant="filled"
                    label="Promo Code"
                    error={!!errors.promoCode}
                  />
                )}
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

        <Footer>{!isMobile && renderPlaceOrderButton()}</Footer>
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
  box-sizing: border-box;
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
  display: flex;
  align-self: center;
  font-weight: 400;
  font-size: ${theme.font.size.l};
  color: ${theme.color.background};
`
const CustomAutocomplete = styled(Autocomplete)`
  display: flex;
  width: 100%;
  border-radius: 5px;
  & .MuiInputBase-root {
    height: 50px;
    font-size: ${theme.font.size.m};
  }
`

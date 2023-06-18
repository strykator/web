'use client'

import React, {useState, useEffect} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import styled from 'styled-components'
import {
  Grid,
  Paper,
  Box,
  Typography,
  Rating,
  Stack,
  ButtonGroup,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import {useDispatch, useSelector} from 'react-redux'
import MenuBar from '@/components/MenuBar'
import {useWindow, useResponsive} from '@/hooks'
import {theme} from '@/theme'
import dish from '@/assets/images/dish.png'
import {truncate} from '@/utils'
import {
  Item,
  addItem,
  removeItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  addOrUpdateCartIds,
  toggleShowShoppingCart,
  emptyCart,
  selectItems,
  selectEntityId,
  selectUserId,
  selectTotalPrice,
  selectShowShoppingCart,
} from '@/redux/cart/cartSlice'
import {selectUserUid} from '@/redux/user/userSlice'
import {RootState} from '@/redux'
import Button from '@/components/Button'
import Image from '@/components/Image'
import Modal from '@/components/Modal'
import {getRestaurantById} from './utils'
import {formatCurrency} from '@/utils'
import {ShowChart} from '@mui/icons-material'

export default function Page({params}: {params: {slug: string}}) {
  const [isOpenModal, setOpenModal] = useState<boolean>(false)
  const [addedItem, setAddedItem] = useState<any>(null)
  const {fullHeight, isTop} = useWindow()
  const {isMobile, isTablet} = useResponsive()
  const router = useRouter()
  const searchParams = useSearchParams()
  const restaurantId = params.slug
  const restaurant = getRestaurantById(restaurantId)
  const state = useSelector((state: RootState) => state)
  const items = selectItems(state)
  const entityId = selectEntityId(state)
  const subTotal = selectTotalPrice(state)
  const shouldShowShoppingCart = selectShowShoppingCart(state)
  const userId = selectUserId(state)
  const userUid = selectUserUid(state)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isMobile || isTablet) {
      dispatch(toggleShowShoppingCart(false))
    } else {
      dispatch(toggleShowShoppingCart(true))
    }
  }, [isMobile, isTablet])

  const handleAddItem = (item: any) => {
    if (entityId && entityId !== restaurantId) {
      setAddedItem(item)
      setOpenModal(true)
      return
    }
    onAddItem(item)
  }
  const onAddItem = (item: any) => {
    const payload: Item = {
      itemId: item.key + new Date().getTime(),
      name: item.title,
      price: item.price,
      quantity: 1,
      photoUrl: item.img,
    }
    dispatch(addItem(payload))

    if (entityId !== restaurantId || userId !== userUid)
      dispatch(addOrUpdateCartIds({userId: userUid, entityId: restaurantId}))
  }

  const renderButtons = (item: Item) => {
    const {quantity} = item
    const handleRemove = () => {
      if (quantity === 1) {
        const payload = {
          itemId: item.itemId,
        }
        dispatch(removeItem(payload))
      } else {
        dispatch(decreaseItemQuantity(item))
      }
    }
    const handleIncrease = () => {
      dispatch(increaseItemQuantity(item))
    }
    const renderDecreaseIcons = () => {
      switch (quantity) {
        case 1:
          return '☠️'
        case 2:
          return '😱'
        case 3:
          return '😐'
        case 4:
          return '🙂'
        case 5:
          return '😉'
        case 6:
          return '🥰'
        case 7:
          return '😍'
        default:
          return '🤩'
      }
    }
    return [
      <Button key="one" title={'+'} onClick={handleIncrease} />,
      <Button key="two" title={`${quantity}`} onClick={() => {}} />,
      <Button
        key="three"
        title={renderDecreaseIcons()}
        onClick={handleRemove}
        backgroundColor={quantity === 1 ? theme.color.error : undefined}
      />,
    ]
  }

  const renderEmptyShoppingCart = () => {
    return items.length === 0 ? (
      <EmptyCartContainer>
        <EmptyCart />
        <TextWeak>Add items to get started</TextWeak>
      </EmptyCartContainer>
    ) : null
  }

  const renderCheckout = () => {
    return items.length !== 0 ? (
      <RightHeader>
        <TextWeak>Order From:</TextWeak>
        <Title>{restaurant.name}</Title>
        <Box mt={2}>
          <Button
            title={`Checkout - ${formatCurrency(subTotal)}`}
            onClick={() => dispatch(emptyCart())}
            width="100%"
          />
        </Box>
      </RightHeader>
    ) : null
  }
  const onCloseModal = () => setOpenModal(false)

  const handleClickYesModal = () => {
    dispatch(emptyCart())
    onAddItem(addedItem)
    onCloseModal()
  }

  return (
    <Stack>
      <Modal
        isOpen={isOpenModal}
        onClose={onCloseModal}
        bgColor={theme.color.background}>
        <Stack
          width={'50%'}
          display="flex"
          alignSelf={'center'}
          spacing={1}
          alignItems={'center'}>
          <TextWeak>Adding new item will empty the current cart</TextWeak>
          <Title>Are you sure?</Title>
          <Button
            title="YES"
            onClick={handleClickYesModal}
            width="50%"
            type="outlined"
          />
          <Button title="NO" onClick={onCloseModal} width="50%" />
        </Stack>
      </Modal>
      <MenuBar
        sticky
        textColor={theme.color.primaryDark}
        bgColor={theme.color.background}
      />
      <Container>
        <LeftContainer variant="outlined" isMobile={isMobile || isTablet}>
          <Banner>
            <BannerContainer>
              <BannerTop src={restaurant.photoUrl} alt="Cover" />
              <Avatar
                src={restaurant.logoUrl}
                alt="logo"
                width={100}
                height={100}
                type="contain"
              />
            </BannerContainer>
          </Banner>
          <LeftHeader>
            <RestaurantText>{restaurant.name}</RestaurantText>
            <SubTitle variant="body2">{restaurant.address}</SubTitle>
            <CustomRating
              size="large"
              name="half-rating-read"
              defaultValue={restaurant.rating}
              precision={0.5}
              readOnly
            />
          </LeftHeader>
          <LeftBody>
            <Box sx={{flexGrow: 1}}>
              <Grid container spacing={3}>
                {restaurant.menu.map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Content
                      variant="outlined"
                      onClick={() => handleAddItem(item)}>
                      <MenuImage
                        src={item.img === '' ? dish : item.img}
                        alt="photo"
                        type="cover"
                      />
                      <ContainerText>
                        <Title>{item.title}</Title>
                        <SubTitle variant="body2">
                          {truncate(item.description, 50)}
                        </SubTitle>
                        <Price>{formatCurrency(item.price)}</Price>
                        {item.rating !== 0 ? (
                          <CustomRating
                            size="small"
                            name="half-rating-read"
                            defaultValue={item.rating}
                            precision={0.5}
                            readOnly
                          />
                        ) : null}
                      </ContainerText>
                    </Content>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </LeftBody>
        </LeftContainer>
        <RightContainer
          elevation={3}
          fullHeight={fullHeight}
          isMobile={isMobile}
          isTablet={isTablet}
          showCart={Boolean(shouldShowShoppingCart)}>
          {renderCheckout()}
          <Stack borderTop={1} borderColor={theme.color.hover}>
            {renderEmptyShoppingCart()}

            {items.map((el, index) => {
              return (
                <CartItemContainer
                  container
                  key={index}
                  borderBottom={1}
                  borderColor={theme.color.hover}
                  pt={1}
                  pb={1}>
                  <Grid
                    item
                    xs={3}
                    md={3}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}>
                    <CartItemImage
                      src={el.photoUrl === '' ? dish : el.photoUrl}
                      alt={el.name}
                      type="cover"
                    />
                  </Grid>
                  <Grid item xs={7} md={7}>
                    <Stack pl={2}>
                      <Title>{el.name}</Title>
                      <Price size="small">{formatCurrency(el.price)}</Price>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    md={2}
                    display={'flex'}
                    justifyContent={'center'}
                    zIndex={1}>
                    <ButtonGroup
                      size="large"
                      disableElevation
                      orientation="vertical"
                      aria-label="vertical contained button group"
                      variant="text">
                      {renderButtons(el)}
                    </ButtonGroup>
                  </Grid>
                </CartItemContainer>
              )
            })}
          </Stack>
          <RightFooter />
        </RightContainer>
      </Container>
    </Stack>
  )
}

const Container = styled(Box)`
  display: flex;
  justify-content: flex-start;
  padding-top: 10px;
`
const LeftContainer = styled(Paper)<{isMobile?: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${({isMobile}) => (isMobile ? '100%' : '74.5%')};
  padding-top: 20px;
  padding-left: 4%;
  padding-right: 4%;
  padding-bottom: 5%;
  gap: 20px;
  box-sizing: border-box;
`
const RightContainer = styled(Paper)<{
  fullHeight: number
  isMobile: boolean
  isTablet: boolean
  showCart: boolean
}>`
  position: ${({isMobile}) => (isMobile ? 'absolute' : 'fixed')};
  top: 60px;
  right: ${({isMobile, isTablet, showCart}) => {
    if ((isMobile || isTablet) && !showCart) {
      return '-100%'
    } else {
      return '0px'
    }
  }};
  height: ${({fullHeight}) => (fullHeight ? `${fullHeight}px` : '100vh')};
  width: ${({isMobile, isTablet, showCart}) => {
    if (isMobile && showCart) {
      return '100%'
    } else if (isTablet && showCart) {
      return '30%'
    } else if ((isMobile || isTablet) && !showCart) {
      return '0%'
    } else {
      return '25%'
    }
  }};
  overflow: auto;
  z-index: 1;
  transition: 0.5s ease;
`
const RightHeader = styled(Grid)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 5%;
  padding-right: 5%;
  padding-bottom: 15px;
`
const RightFooter = styled('div')`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 20px;
  margin-bottom: 50px;
`
const BannerContainer = styled('div')<{isMobile?: boolean}>`
  height: 80%;
  width: 100%;
  position: relative;
`
const Banner = styled('div')`
  display: flex;
  flex-direction: column;
  height: 250px;
  width: 100%;
  border-radius: 10px;
  background-color: transparent;
`
const BannerTop = styled(Image)`
  border-radius: 10px;
  object-fit: cover;
  object-position: 75% 25%;
`
const Avatar = styled(Image)`
  margin-top: -50px;
  margin-left: 60px;
  border-radius: 50px;
  background-color: ${theme.color.avatarCover};
`
const LeftHeader = styled(Grid)`
  display: flex;
  flex-direction: column;
  height: 100px;
  width: 100%;
`
const LeftBody = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
const RestaurantText = styled(Typography)`
  font-size: 30px;
  color: ${theme.color.primaryDark};
  line-height: 30px;
`
const SubTitle = styled(Typography)`
  font-size: ${theme.font.size.s};
  color: ${theme.color.textWeak};
  margin-top: 5px;
`
const MenuImage = styled(Image)`
  width: 100%;
  height: 100%;
  border-radius: 2px;
`
const Content = styled(Paper)`
  display: flex;
  flex-direction: row;
  height: 20vh;
  &:hover {
    cursor: pointer;
  }
`
const ContainerText = styled('div')`
  display: flex;
  flex-direction: column;
  padding-top: 15px;
  padding-left: 15px;
  padding-right: 15px;
  width: 100%;
  justify-content: flex-start;
`
const Title = styled(Typography)`
  font-size: ${theme.font.size.m};
  font-weight: 400;
  color: ${theme.color.text};
  line-height: 18px;
`
const CustomRating = styled(Rating)`
  margin-top: 10px;
`
const CartItemContainer = styled(Grid)`
  width: 100%;
  &:hover {
    cursor: pointer;
    background-color: ${theme.color.hover};
  }
`
const CartItemImage = styled(Image)`
  display: flex;
  justify-content: flex-end;
  margin-left: 5px;
  width: 80%;
  height: 90%;
  border-radius: 5px;
`
const Price = styled(Typography)<{size?: 'small' | 'large'}>`
  font-size: ${({size}) => {
    if (size === 'small') return theme.font.size.s
    return theme.font.size.m
  }};
  color: ${theme.color.text};
  font-weight: 500;
  line-height: 20px;
`
const EmptyCartContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
`
const EmptyCart = styled(ShoppingCartIcon)`
  width: 40%;
  height: auto;
  color: ${theme.color.avatarCover};
`
const TextWeak = styled(Typography)`
  margin-top: 10px;
  font-size: ${theme.font.size.s};
  font-weight: 300;
  color: ${theme.color.textWeak};
`

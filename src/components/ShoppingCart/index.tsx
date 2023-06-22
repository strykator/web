'use client'

import React, {useEffect} from 'react'
import styled from 'styled-components'
import {useRouter, usePathname} from 'next/navigation'
import {
  Grid,
  Paper,
  Box,
  Typography,
  Stack,
  ButtonGroup,
  IconButton,
  Link,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import {
  ArrowForward,
  DeleteForeverRounded,
  AddRoadRounded,
  AddRounded,
} from '@mui/icons-material'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '@/redux'
import {
  Item,
  selectShowShoppingCart,
  selectItems,
  selectEntityId,
  selectTotalPrice,
  emptyCart,
  toggleShowShoppingCart,
  removeItem,
  decreaseItemQuantity,
  increaseItemQuantity,
} from '@/redux/cart/cartSlice'
import {theme} from '@/theme'
import {useResponsive, useWindow} from '@/hooks'
import Button from '@/components/Button'
import Image from '@/components/Image'
import {formatCurrency, getRestaurantById} from '@/utils'
import dish from '@/assets/images/dish.png'

interface IShoppingCar {
  horizontal?: boolean
}

export default function ShoppingCart({horizontal}: IShoppingCar) {
  const {isMobile, isTablet} = useResponsive()
  const {fullHeight, scrollY} = useWindow()
  const router = useRouter()
  const pathName = usePathname()
  const state = useSelector((state: RootState) => state)
  const dispatch = useDispatch()
  const shouldShowShoppingCart = selectShowShoppingCart(state)
  const items = selectItems(state)
  const restaurantId = selectEntityId(state)
  const restaurant = getRestaurantById(restaurantId)
  const subTotal = selectTotalPrice(state)

  useEffect(() => {
    if (
      isMobile ||
      isTablet ||
      !pathName.includes('restaurants') ||
      pathName.includes('checkout')
    ) {
      dispatch(toggleShowShoppingCart(false))
    } else {
      dispatch(toggleShowShoppingCart(true))
    }
  }, [isMobile, isTablet, pathName])

  useEffect(() => {
    if (items.length === 0 && restaurantId) dispatch(emptyCart())
  }, [items])

  const renderCloseShoppingCart = () => {
    return (
      (isMobile || isTablet || !pathName.includes('restaurants')) && (
        <Box pt={1}>
          <IconButton onClick={() => dispatch(toggleShowShoppingCart(false))}>
            <ArrowForward style={{color: theme.color.primaryDark}} />
          </IconButton>
        </Box>
      )
    )
  }
  const renderHeaderCheckout = () => {
    const handleCheckout = () => {
      router.push(`/restaurants/${restaurantId}/checkout`)
    }
    return items.length !== 0 ? (
      <Header>
        {renderCloseShoppingCart()}
        <TextWeak>Order From:</TextWeak>
        <RestaurantName href={`/restaurants/${restaurantId}`}>
          {restaurant.name}
        </RestaurantName>
        <Box mt={2}>
          <Button
            title={`Checkout - ${formatCurrency(subTotal)}`}
            onClick={handleCheckout}
            width="100%"
          />
        </Box>
      </Header>
    ) : null
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

    return [
      <Button key="one" onClick={handleIncrease}>
        <AddRounded style={{height: '17px'}} />
      </Button>,
      <Button key="two" title={`${quantity}`} onClick={() => {}} />,
      <Button
        key="three"
        onClick={handleRemove}
        backgroundColor={theme.color.error}>
        <DeleteForeverRounded style={{height: '17px'}} />
      </Button>,
    ]
  }
  const renderEmptyShoppingCart = () => {
    return items.length === 0 ? (
      <>
        {renderCloseShoppingCart()}
        <EmptyCartContainer>
          <EmptyCart />
          <TextWeak>Add items to get started</TextWeak>
        </EmptyCartContainer>
      </>
    ) : null
  }

  return (
    <Container
      elevation={horizontal ? 0 : 1}
      fullHeight={fullHeight}
      isMobile={isMobile}
      isTablet={isTablet}
      showCart={Boolean(shouldShowShoppingCart)}
      scrollY={scrollY}
      horizontal={Boolean(horizontal)}>
      {!horizontal && renderHeaderCheckout()}
      <Stack borderTop={1} borderColor={theme.color.hover}>
        {!horizontal && renderEmptyShoppingCart()}

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
                  <Price>{formatCurrency(el.price)}</Price>
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
    </Container>
  )
}

const Container = styled(Paper)<{
  fullHeight: number
  isMobile: boolean
  isTablet: boolean
  showCart: boolean
  scrollY: number
  horizontal: boolean
}>`
  position: ${({isMobile, horizontal}) => {
    if (horizontal) {
      return 'relative'
    } else {
      return isMobile ? 'absolute' : 'fixed'
    }
  }};
  top: ${({scrollY, horizontal}) => {
    if (horizontal) {
      return 'auto'
    } else {
      return scrollY > 10 ? '0px' : '70px'
    }
  }};
  right: ${({showCart, horizontal}) => {
    if (horizontal) {
      return 'auto'
    } else {
      return !showCart ? '-100%' : '0px'
    }
  }};
  height: ${({horizontal}) => {
    if (horizontal) {
      return 'auto'
    } else {
      return '100vh'
    }
  }};
  width: ${({horizontal, isMobile, isTablet, showCart}) => {
    if (horizontal || (isMobile && showCart)) {
      return '100%'
    } else if (isTablet && showCart) {
      return '40%'
    } else if (!showCart) {
      return '0%'
    } else {
      return '25%'
    }
  }};
  overflow: auto;
  z-index: ${({horizontal}) => {
    if (horizontal) {
      return 'auto'
    } else {
      return '1'
    }
  }};
  transition: 0.5s ease;
`
const RestaurantName = styled(Link)`
  font-size: ${theme.font.size.m};
  line-height: 20px;
  color: ${theme.color.text};
  text-decoration-color: transparent;
  &:hover {
    text-decoration-color: ${theme.color.primaryDark};
  }
`
const Title = styled(Typography)`
  font-size: ${theme.font.size.m};
  line-height: 20px;
  color: ${theme.color.text};
`
const Subtitle = styled(Typography)`
  font-size: ${theme.font.size.s};
  line-height: 20px;
  color: ${theme.color.text};
`
const TextWeak = styled(Typography)`
  margin-top: 10px;
  font-size: ${theme.font.size.s};
  font-weight: 300;
  color: ${theme.color.textWeak};
`
const Price = styled(Subtitle)`
  font-weight: 500;
`
const Header = styled(Grid)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 5%;
  padding-right: 5%;
  padding-bottom: 15px;
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
const Footer = styled('div')`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 20px;
  margin-bottom: 50px;
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

'use client'

import React from 'react'
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
  emptyCart,
  selectItems,
  selectEntityId,
  selectUserId,
  selectTotalPrice,
} from '@/redux/cart/cartSlice'
import {selectUserUid} from '@/redux/user/userSlice'
import {RootState} from '@/redux'
import Button from '@/components/Button'
import Image from '@/components/Image'
import {getRestaurantById} from './utils'

export default function Page({params}: {params: {slug: string}}) {
  const {fullHeight, isTop} = useWindow()
  const {isMobile} = useResponsive()
  const router = useRouter()
  const searchParams = useSearchParams()
  const restaurantId = params.slug
  const restaurant = getRestaurantById(restaurantId)
  const state = useSelector((state: RootState) => state)
  const items = selectItems(state)
  const entityId = selectEntityId(state)
  const subTotal = selectTotalPrice(state)
  const userId = selectUserId(state)
  const userUid = selectUserUid(state)
  const dispatch = useDispatch()

  const handleAddItem = (item: any) => {
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
      <RightHeader pr={1}>
        <TextWeak>Order From:</TextWeak>
        <Title>{restaurant.name}</Title>
        <Box mt={2}>
          <Button
            title={`Checkout - $${subTotal}`}
            onClick={() => dispatch(emptyCart())}
            width="100%"
          />
        </Box>
      </RightHeader>
    ) : null
  }

  return (
    <Stack>
      <MenuBar
        sticky
        textColor={theme.color.primaryDark}
        bgColor={theme.color.background}
      />
      <Container>
        <LeftContainer variant="outlined">
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
                        <Price>${item.price}</Price>
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
        <RightContainer elevation={3} fullHeight={fullHeight}>
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
                    <Stack pl={1}>
                      <Title>{el.name}</Title>
                      <Price size="small">${el.price}</Price>
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
  gap: 10px;
`
const LeftContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  padding-top: 20px;
  padding-left: 2%;
  padding-right: 2%;
  padding-bottom: 10%;
  gap: 20px;
`
const RightContainer = styled(Paper)<{fullHeight: number}>`
  position: fixed;
  top: 60px;
  right: 0;
  height: 100vh;
  width: 25%;
  overflow: auto;
`
const RightHeader = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 90%;
  padding-left: 5%;
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
  font-weight: 500;
  color: ${theme.color.text};
  line-height: 18px;
`
const CustomRating = styled(Rating)`
  margin-top: 10px;
`
const Separator = styled('span')`
  margin-top: 8px;
  margin-bottom: 8px;
  height: 0.5px;
  width: 100%;
  background-color: ${theme.color.textWeak};
`
const CartItemContainer = styled(Grid)`
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

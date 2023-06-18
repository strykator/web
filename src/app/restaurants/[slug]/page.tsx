'use client'

import React, {useState, useEffect} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import styled from 'styled-components'
import {Grid, Paper, Box, Typography, Rating, Stack} from '@mui/material'
import {useDispatch, useSelector} from 'react-redux'
import MenuBar from '@/components/MenuBar'
import {useResponsive} from '@/hooks'
import {theme} from '@/theme'
import dish from '@/assets/images/dish.png'
import {truncate} from '@/utils'
import {
  Item,
  addItem,
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

export default function Page({params}: {params: {slug: string}}) {
  const [isOpenModal, setOpenModal] = useState<boolean>(false)
  const [addedItem, setAddedItem] = useState<any>(null)
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
const Price = styled(Typography)<{size?: 'small' | 'large'}>`
  font-size: ${({size}) => {
    if (size === 'small') return theme.font.size.s
    return theme.font.size.m
  }};
  color: ${theme.color.text};
  font-weight: 500;
  line-height: 20px;
`
const TextWeak = styled(Typography)`
  margin-top: 10px;
  font-size: ${theme.font.size.s};
  font-weight: 300;
  color: ${theme.color.textWeak};
`

'use client'

import React from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import styled from 'styled-components'
import Image from 'next/image'
import {
  Grid,
  Paper,
  Box,
  Typography,
  Rating,
  Stack,
  ButtonGroup,
} from '@mui/material'
import {useDispatch, useSelector} from 'react-redux'
import MenuBar from '@/components/MenuBar'
import {useWindow, useResponsive} from '@/hooks'
import {theme} from '@/theme'
import restaurant from '@/assets/images/restaurant.png'
import {data} from '@/utils'
import dish from '@/assets/images/dish.png'
import {truncate} from '@/utils'
import {
  addItem,
  removeItem,
  updateItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  emptyCart,
  Item,
  selectItems,
} from '@/redux/cart/cartSlice'
import {RootState} from '@/redux'
import Button from '@/components/Button'

const bannerUrl =
  'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/8a4704ab-9dae-48e9-af6d-af0a2d2e6ac9.jpg'

export default function Page({params}: {params: {slug: string}}) {
  const {fullHeight, isTop} = useWindow()
  const {isMobile} = useResponsive()
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = useSelector((state: RootState) => state)
  const items = selectItems(state)
  const dispatch = useDispatch()

  const handleAddItem = (item: any) => {
    const payload: Item = {
      itemId: item.key,
      name: item.title,
      price: item.price,
      quantity: 1,
    }
    dispatch(addItem(payload))
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
      <Button key="one" title={'+'} onClick={handleIncrease} />,
      <Button key="two" title={`${quantity}`} onClick={() => {}} />,
      <Button
        key="three"
        title={`${quantity === 1 ? 'x' : '-'}`}
        onClick={handleRemove}
        backgroundColor={quantity === 1 ? theme.color.error : undefined}
      />,
    ]
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
              <BannerTop
                fill
                src={bannerUrl}
                alt="Cover"
                style={{objectFit: 'cover'}}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <Avatar
                src={restaurant}
                alt="Cover"
                width={100}
                height={100}
                style={{objectFit: 'contain', objectPosition: '10px'}}
              />
            </BannerContainer>
          </Banner>
          <LeftHeader>
            <RestaurantText variant="subtitle1">
              Han's Deli & Boba
            </RestaurantText>
            <SubTitle variant="body2">
              7618 Highway 70 South 101, Nashville, TN
            </SubTitle>
            <CustomRating
              size="large"
              name="half-rating-read"
              defaultValue={4.5}
              precision={0.5}
              readOnly
            />
          </LeftHeader>
          <LeftBody>
            <Box sx={{flexGrow: 1}}>
              <Grid container spacing={3}>
                {data.map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Content
                      variant="outlined"
                      onClick={() => handleAddItem(item)}>
                      <ImageContainer isMobile={isMobile}>
                        <CustomeImage
                          fill
                          src={item.img === '' ? dish : item.img}
                          alt={item.title}
                          style={{objectFit: 'cover'}}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </ImageContainer>
                      <ContainerText>
                        <Title variant="subtitle1">{item.title}</Title>
                        <SubTitle variant="body2">
                          {truncate(item.description, 50)}
                        </SubTitle>
                        <CustomRating
                          size="small"
                          name="half-rating-read"
                          defaultValue={item.rating}
                          precision={0.5}
                          readOnly
                        />
                      </ContainerText>
                    </Content>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </LeftBody>
        </LeftContainer>
        <RightContainer elevation={3} fullHeight={fullHeight}>
          <RightHeader>
            <Button
              title="Clear Cart"
              onClick={() => dispatch(emptyCart())}
              width="120px"
            />
          </RightHeader>
          <Separator />
          <Stack borderTop={1} borderColor={theme.color.hover}>
            {items.map((el, index) => {
              return (
                <CartItemContainer
                  container
                  key={index}
                  borderBottom={1}
                  borderColor={theme.color.hover}
                  pt={1}
                  pb={1}>
                  <Grid item xs={10} md={10}>
                    <Stack pl={1}>
                      <SubTitle variant="body2">itemId: {el.itemId}</SubTitle>
                      <SubTitle variant="body2">name: {el.name}</SubTitle>
                      <SubTitle variant="body2">price: {el.price}</SubTitle>
                      <SubTitle variant="body2">
                        quantity: {el.quantity}
                      </SubTitle>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    md={2}
                    alignItems={'center'}
                    zIndex={1}
                    display={'flex'}>
                    <ButtonGroup
                      size="large"
                      fullWidth
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
  justify-content: flex-end;
  width: 100%;
  height: 60px;
  padding-top: 20px;
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
  position: absolute;
  left: 50px;
  bottom: -50px;
  height: 100px;
  width: 100px;
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
const CustomeImage = styled(Image)`
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
const ImageContainer = styled('div')<{isMobile: boolean}>`
  width: 100%;
  height: 100%;
  position: relative;
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
  color: ${theme.color.text};
  line-height: 20px;
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

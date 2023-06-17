'use client'

import React from 'react'
import Image from 'next/image'
import MenuBar from '@/components/MenuBar'
import styled from 'styled-components'
import {Grid, Paper, Box, Typography, Rating, Stack} from '@mui/material'
import {useRouter} from 'next/navigation'
import banner from '@/assets/images/banner3.jpeg'
import Footer from '@/components/Footer'
import dish from '@/assets/images/dish.png'
import {useResponsive} from '@/hooks'
import {theme} from '@/theme'
import {restaurants} from '@/constants'

const Home = () => {
  const router = useRouter()
  const {isMobile} = useResponsive()
  const onClickRestaurant = (id: string) => {
    router.push(`/restaurants/${id}`)
  }
  return (
    <>
      <MenuBar sticky={isMobile} />
      {!isMobile ? (
        <Banner src={banner} alt="Feast" height={window.innerHeight} />
      ) : null}
      <Box
        p={4}
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
        }}>
        <Grid container spacing={3} maxWidth={1200}>
          {restaurants.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Content elevation={1} onClick={() => onClickRestaurant(item.id)}>
                <ImageContainer isMobile={isMobile}>
                  <CustomeImage
                    fill
                    src={item.photoUrl === '' ? dish : item.photoUrl}
                    alt={item.name}
                    style={{objectFit: 'cover'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </ImageContainer>
                <ContainerText>
                  <Title>{item.name}</Title>
                  <SubTitle>{item.address}</SubTitle>
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
      <Footer />
    </>
  )
}

const Banner = styled(Image)`
  width: 100%;
`
const CustomeImage = styled(Image)`
  border-radius: 2px;
`
const Content = styled(Paper)`
  display: flex;
  flex-direction: column;
  height: 30vh;
  width: 100%;
  &:hover {
    cursor: pointer;
  }
`
const ImageContainer = styled('div')<{isMobile: boolean}>`
  width: 100%;
  height: 67%;
  position: relative;
`
const ContainerText = styled(Stack)`
  display: flex;
  flex-direction: column;
  padding-top: 5px;
  padding-left: 20px;
  padding-bottom: 5px;
  width: 100%;
  justify-content: flex-start;
  box-sizing: border-box;
`
const Title = styled(Typography)`
  font-size: ${theme.font.size.m};
  color: ${theme.color.primaryDark};
`
const SubTitle = styled(Typography)`
  font-size: ${theme.font.size.s};
  color: ${theme.color.textWeak};
`
const CustomRating = styled(Rating)`
  margin-top: 10px;
`

export default Home

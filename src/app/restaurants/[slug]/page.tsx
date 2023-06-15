'use client'

import React from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import styled from 'styled-components'
import Image from 'next/image'
import {Grid, Paper, Box, Typography, Link} from '@mui/material'
import MenuBar from '@/components/MenuBar'
import {useWindow, useResponsive} from '@/hooks'
import {theme} from '@/theme'
import profileCover from '@/assets/images/profile_cover.jpg'
import maleAvatar from '@/assets/images/3d_male_avatar.png'
import restaurant from '@/assets/images/restaurant.png'
import {data} from '@/utils'
import dish from '@/assets/images/dish.png'

const bannerUrl =
  'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/8a4704ab-9dae-48e9-af6d-af0a2d2e6ac9.jpg'

export default function Page({params}: {params: {slug: string}}) {
  const {fullHeight} = useWindow()
  const {isMobile} = useResponsive()
  const router = useRouter()
  const searchParams = useSearchParams()
  return (
    <Container>
      <MenuBar textColor={theme.color.primaryDark} />
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
          <RestaurantText
            href="/restaurants/id"
            variant="subtitle1"
            underline="none">
            Restaurant
          </RestaurantText>
          <SubTitle variant="body2">more description here</SubTitle>
          <SubTitle variant="body2">4.7 rating</SubTitle>
        </LeftHeader>
        <LeftBody>
          <Box sx={{flexGrow: 1}}>
            <Grid container spacing={3}>
              {data.map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Content elevation={1}>
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
                        Vietnamese sandwich, served on in-house baked baguette,
                        comes with House Mayo, Liver Pate, Cucumber, Cilantro...
                      </SubTitle>
                      <SubTitle variant="body2">4.7 rating</SubTitle>
                    </ContainerText>
                  </Content>
                </Grid>
              ))}
            </Grid>
          </Box>
        </LeftBody>
      </LeftContainer>
      <RightContainer elevation={3} fullHeight={fullHeight}></RightContainer>
    </Container>
  )
}

const Container = styled(Box)`
  display: flex;
  justify-content: center;
  padding-top: 70px;
  background-color: transparent;
  gap: 10px;
`
const LeftContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  padding-top: 20px;
  padding-left: 10%;
  padding-right: 10%;
  padding-bottom: 10%;
  gap: 20px;
`
const RightContainer = styled(Paper)<{fullHeight: number}>`
  display: flex;
  height: ${({fullHeight}) => (fullHeight ? fullHeight : '100vh')};
  width: 25%;
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
const RestaurantText = styled(Link)`
  font-size: 30px;
  color: ${theme.color.primaryDark};
`
const SubTitle = styled(Typography)`
  font-size: ${theme.font.size.s};
  color: ${theme.color.textWeak};
`
const CustomeImage = styled(Image)`
  border-radius: 2px;
`
const Content = styled(Paper)`
  display: flex;
  flex-direction: row;
  height: 20vh;
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
  color: ${theme.color.text};
`

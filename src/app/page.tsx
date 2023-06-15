'use client'

import React from 'react'
import Image from 'next/image'
import MenuBar from '@/components/MenuBar'
import styled from 'styled-components'
import {Grid, Paper, Box, Typography, Link} from '@mui/material'
import banner from '@/assets/images/banner3.jpeg'
import {data} from '@/utils'
import Footer from '@/components/Footer'
import dish from '@/assets/images/dish.png'
import {useResponsive} from '@/hooks'
import {theme} from '@/theme'

const Home = () => {
  const {isMobile} = useResponsive()
  return (
    <>
      <MenuBar />
      <Banner src={banner} alt="Feast" height={window.innerHeight} />
      <Box p={3} sx={{flexGrow: 1}}>
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
                  <Title
                    href="/restaurants/id"
                    variant="subtitle1"
                    underline="none">
                    {item.title}
                  </Title>
                  <SubTitle variant="body2">more description here</SubTitle>
                  <SubTitle variant="body2">4.7 rating</SubTitle>
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
  height: 40vh;
`
const ImageContainer = styled('div')<{isMobile: boolean}>`
  width: 100%;
  height: 67%;
  position: relative;
`
const ContainerText = styled('div')`
  display: flex;
  flex-direction: column;
  padding-top: 15px;
  padding-left: 20px;
  width: 100%;
  justify-content: flex-start;
`
const Title = styled(Link)`
  color: ${theme.color.primaryDark};
`
const SubTitle = styled(Typography)`
  color: ${theme.color.textWeak};
`

export default Home

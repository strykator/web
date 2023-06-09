'use client'

import React, {useState} from 'react'
import Image from 'next/image'
import MenuBar from '@/components/MenuBar'
import styled from 'styled-components'
import {Grid, Paper, Box, Typography} from '@mui/material'
import banner from '@/assets/images/banner.png'
import {data} from '@/utils'

export default function Home() {
  return (
    <>
      <MenuBar />
      <Banner src={banner} alt="Feast" height={500} />
      <Grid item xs={4}>
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.default',
            display: 'grid',
            gridTemplateColumns: {md: '1fr 1fr'},
            gap: 3,
          }}>
          {data.map((item, index) => (
            <Item key={index} elevation={2}>
              <Content>
                <CustomeImage
                  src={item.img}
                  alt={item.name}
                  width={150}
                  height={150}
                />
                <ContainerText>
                  <Typography variant="subtitle1">{item.name}</Typography>
                </ContainerText>
              </Content>
            </Item>
          ))}
        </Box>
      </Grid>
    </>
  )
}

const Banner = styled(Image)`
  margin-top: -50px;
  width: 100%;
`
const Item = styled(Paper)(({theme}) => ({
  padding: 5,
  height: 150,
}))

const CustomeImage = styled(Image)`
  border-radius: 2px;
`
const Content = styled('div')`
  display: flex;
  flex-direction: 'row';
  padding-top: 0;
`

const ContainerText = styled('div')`
  display: flex;
  width: 100%;
  justify-content: center;
`

'use client'

import React from 'react'
import styled from 'styled-components'
import {Grid, Paper, Box, Typography, Link} from '@mui/material'

const Restaurants = () => {
  return (
    <Container>
      <Title>Restaurants</Title>
    </Container>
  )
}

const Container = styled(Box)`
  background-color: yellow;
`

const Title = styled(Typography)`
  font-size: 50px;
`

export default Restaurants

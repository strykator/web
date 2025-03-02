'use client'

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useRouter, usePathname} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {Grid, Paper, Box, Typography, Rating, Stack} from '@mui/material'
import {theme} from '@/theme'
import {useResponsive} from '@/hooks'
import {RootState} from '@/redux'
import {selectUserUid} from '@/redux/user/userSlice'

export default function Admin() {
  const router = useRouter()
  const pathName = usePathname()
  const {isMobile} = useResponsive()
  const appState = useSelector((state: RootState) => state)
  const userId = selectUserUid(appState)

  return (
    <Container>
      <Text>Admin</Text>
    </Container>
  )
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 50px;
  min-height: 100vh;
  background-color: ${theme.color.background};
  box-sizing: border-box;
`
const Text = styled(Typography)`
  color: ${theme.color.text};
  font-size: ${theme.font.size.l};
  font-family: ${theme.font.family};
`

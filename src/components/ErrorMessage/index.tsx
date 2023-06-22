'use client'
import React from 'react'
import styled from 'styled-components'
import {Typography} from '@mui/material'
import {theme} from '@/theme'

export default function ErrorMessage({children}: {children: React.ReactNode}) {
  return <Message>{children}</Message>
}

const Message = styled(Typography)`
  font-size: ${theme.font.size.s};
  font-weight: 400;
  color: ${theme.color.error};
  margin-bottom: 5px;
  margin-top: 5px;
`

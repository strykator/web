'use client'
import React from 'react'
import {Button as MButton, Typography} from '@mui/material'
import styled from 'styled-components'

type ButtonType = 'text' | 'outlined' | 'contained'
interface IButton {
  title: string
  onClick: () => void
  type?: ButtonType
  disabled?: boolean
  height?: string
  width?: string
}

const Button = ({
  title,
  disabled,
  onClick,
  height = '25px',
  width = '40px',
  type = 'contained',
}: IButton) => {
  return (
    <Container
      variant={type}
      onMouseDown={onClick}
      height={height}
      width={width}
      disabled={disabled}>
      <Text>{title}</Text>
    </Container>
  )
}

const Container = styled(MButton)<{height: string; width: string}>`
  height: ${({height}) => (height ? height : '25px')};
  width: ${({width}) => (width ? width : '40px')};
  padding: 14px 14px;
  justify-content: center;
  align-items: center;
  text-transform: none;
`
const Text = styled(Typography)`
  font-size: ${({theme}) => theme.font.size.m};
  font-weight: 400;
`

export default Button

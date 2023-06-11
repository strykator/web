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
  backgroundColor?: string
  borderColor?: string
  titleColor?: string
}

const Button = ({
  title,
  disabled,
  onClick,
  height = '25px',
  width = '40px',
  type = 'contained',
  backgroundColor,
  borderColor,
  titleColor,
}: IButton) => {
  return (
    <Container
      variant={type}
      onMouseDown={onClick}
      height={height}
      width={width}
      disabled={disabled}
      backgroundColor={backgroundColor}
      borderColor={borderColor}>
      <Text titleColor={titleColor}>{title}</Text>
    </Container>
  )
}

const Container = styled(MButton)<{
  height: string
  width: string
  backgroundColor?: string
  borderColor?: string
}>`
  height: ${({height}) => (height ? height : '25px')};
  width: ${({width}) => (width ? width : '40px')};
  padding: 14px 14px;
  justify-content: center;
  align-items: center;
  text-transform: none;
  border-color: ${({borderColor}) => (borderColor ? borderColor : 'auto')};
  background-color: ${({backgroundColor}) =>
    backgroundColor ? backgroundColor : 'auto'};
`
const Text = styled(Typography)<{titleColor?: string}>`
  font-size: ${({theme}) => theme.font.size.m};
  font-weight: 400;
  color: ${({titleColor}) => (titleColor ? titleColor : 'auto')};
`

export default Button

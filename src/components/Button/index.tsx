'use client'
import React from 'react'
import {Button as MButton, Typography} from '@mui/material'
import styled from 'styled-components'

type ButtonType = 'text' | 'outlined' | 'contained'
interface IButton {
  title?: string
  onClick: () => void
  type?: ButtonType
  disabled?: boolean
  height?: string | number
  width?: string | number
  backgroundColor?: string
  borderColor?: string
  titleColor?: string
  children?: React.ReactNode
}

const Button = ({
  title,
  disabled,
  onClick,
  height,
  width,
  type = 'contained',
  backgroundColor,
  borderColor,
  titleColor,
  children,
  ...props
}: IButton) => {
  return (
    <Container
      variant={type}
      onMouseDown={onClick}
      height={height}
      width={width}
      disabled={disabled}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      {...props}>
      {children ? children : <Text titleColor={titleColor}>{title}</Text>}
    </Container>
  )
}

const Container = styled(MButton)<{
  height: string | number | undefined
  width: string | number | undefined
  backgroundColor?: string
  borderColor?: string
}>`
  height: ${({height}) => {
    if (height) return typeof height === 'string' ? height : `${height}px`
    return 'auto'
  }};
  width: ${({width}) => {
    if (width) return typeof width === 'string' ? width : `${width}px`
    return 'auto'
  }};
  padding: 5px 5px;
  justify-content: center;
  align-items: center;
  text-transform: none;
  border-color: ${({borderColor}) => (borderColor ? borderColor : 'auto')};
  background-color: ${({backgroundColor}) =>
    backgroundColor ? backgroundColor : 'auto'};
  &:hover {
    background-color: ${({backgroundColor}) =>
      backgroundColor ? backgroundColor : 'auto'};
    opacity: ${({backgroundColor}) => (backgroundColor ? '0.8' : 'auto')};
  }
`
const Text = styled(Typography)<{titleColor?: string}>`
  font-size: ${({theme}) => theme.font.size.m};
  font-weight: 400;
  color: ${({titleColor}) => (titleColor ? titleColor : 'auto')};
`

export default Button

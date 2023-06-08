'use client'
import React, {useState} from 'react'
import {Button as MButton} from '@mui/material'
import styled from 'styled-components'

interface IButton {
  title: string
  onClick: () => void
}

const Button = ({title, onClick}: IButton) => {
  const [search, onSearch] = useState('')
  return (
    <Container variant="contained" size="medium" onClick={onClick}>
      <Text>{title}</Text>
    </Container>
  )
}

const Container = styled(MButton)`
  display: flex;
  height: 60%;
  justify-content: center;
  align-items: center;
  text-transform: none;
`
const Text = styled('p')`
  font-size: ${({theme}) => theme.font.size.m};
  font-weight: 400;
`

export default Button

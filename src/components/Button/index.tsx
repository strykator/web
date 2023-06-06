'use client'
import React, {useState} from 'react'
import {Button as AButton, Space} from 'antd'
import styled from 'styled-components'

interface IButton {
  title: string
  onClick: () => void
}

const Button = ({title, onClick}: IButton) => {
  const [search, onSearch] = useState('')
  return (
    <Container type="primary" onClick={onClick}>
      <Text>{title}</Text>
    </Container>
  )
}

const Container = styled(AButton)`
  display: flex;
  justify-content: center;
  align-items: center;
`
const Text = styled('p')`
  font-size: ${({theme}) => theme.font.size.m};
  font-weight: 400;
`

export default Button

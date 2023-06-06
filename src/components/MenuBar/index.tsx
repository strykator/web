'use client'
import React, {useState} from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import Search from '@/components/SearchBar'
import Button from '@/components/Button'
import logo from '@/assets/images/logo.png'

const MenuBar = () => {
  const [search, onSearch] = useState('')
  return (
    <Container>
      <Left>
        <WrapImage
          src={logo}
          alt="Feastta"
          width={55}
          height={55}
          // blurDataURL="data:..." automatically provided
          // placeholder="blur" // Optional blur-up while loading
          onClick={() => alert()}
        />
      </Left>
      <Middle>
        <Search />
      </Middle>
      <Right>
        <Button title="Login" onClick={() => alert()} />
        <Button title="Signup" onClick={() => alert()} />
      </Right>
    </Container>
  )
}

const Container = styled('div')`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 60px;
  background-color: ${({theme}) => theme.color.menu};
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
`

const Left = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
`

const Middle = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
`

const Right = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 25%;
  gap: 10px;
`

const WrapImage = styled(Image)`
  &:hover {
    cursor: pointer;
    /* Set the desired cursor style */
  }
`

const Text = styled('p')`
  font-size: ${({theme}) => theme.font.size.s};
  font-weight: bold;
`

export default MenuBar

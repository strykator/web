'use client'
import React, {useState} from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import {useRouter} from 'next/navigation'
import {Link, Typography} from '@mui/material'
import Button from '@/components/Button'
import logo from '@/assets/images/logo.png'
import {menu} from '@/constants'
import useResponsive from '@/hooks/useResponsive'
import Modal from '@/components/Modal'
import MobileMenu from './MobileMenu'
import Login from './Login'

const MenuBar = () => {
  const router = useRouter()
  const {isMobile} = useResponsive()
  const [isOpenModal, setOpenModal] = useState<boolean>(false)

  return (
    <Container>
      <Left>
        {isMobile && <MobileMenu />}
        {!isMobile && (
          <WrapImage
            src={logo}
            alt="Feastta"
            width={55}
            height={55}
            // blurDataURL="data:..." automatically provided
            // placeholder="blur" // Optional blur-up while loading
            onClick={() => router.push('/')}
          />
        )}
      </Left>
      <Middle>
        {!isMobile &&
          menu.map(item => (
            <CustomLink href={item.path} underline="hover" key={item.key}>
              <Text variant="h6">{item.label}</Text>
            </CustomLink>
          ))}
      </Middle>
      <Right>
        <Button
          title="Account"
          width="70px"
          height="30px"
          onClick={() => setOpenModal(true)}
        />
      </Right>
      <Modal isOpen={isOpenModal} onClose={() => setOpenModal(false)}>
        <Login />
      </Modal>
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
  gap: 15px;
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
  }
`

export const Text = styled(Typography)`
  font-weight: 400;
  font-size: 14px;
  color: ${({theme}) => theme.color.primaryDark};
`

export const CustomLink = styled(Link)`
  &:hover {
    text-decoration-color: ${({theme}) => theme.color.primaryDark};
  }
`

export default MenuBar

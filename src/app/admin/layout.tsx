'use client'

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {Poppins} from 'next/font/google'
import {useRouter, usePathname} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {Grid, Paper, Box, Typography, Rating, Stack} from '@mui/material'
import {theme} from '@/theme'
import {useResponsive} from '@/hooks'
import {RootState} from '@/redux'
import {selectUserUid, selectUserRoles} from '@/redux/user/userSlice'
import DrawerNav from '@/components/DrawerNav'
import Modal from '@/components/Modal'
import Login from '@/components/MenuBar/Login'
import Button from '@/components/Button'
import UserMenu from '@/components/MenuBar/UserMenu'

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
})

export default function AdminLayout({children}: {children: React.ReactNode}) {
  const router = useRouter()
  const pathName = usePathname()
  const {isMobile} = useResponsive()
  const appState = useSelector((state: RootState) => state)
  const userId = selectUserUid(appState)
  const userRoles = selectUserRoles(appState)
  const [open, setOpen] = useState<boolean>(!isMobile)
  const [showModal, setShowModal] = useState<boolean>(false)
  const onCloseModal = () => setShowModal(false)

  useEffect(() => {
    setOpen(!isMobile)
  }, [isMobile])

  useEffect(() => {
    // if(!userRoles?.includes('Admin')) {
    //   router.push('/')
    // }
  }, [userRoles])

  const renderTopBar = () => {
    return (
      <TopContainer>
        {userId ? (
          <UserMenu />
        ) : (
          <Button
            title="Account"
            width="70px"
            height="30px"
            type="outlined"
            onClick={() => setShowModal(true)}
            titleColor={theme.color.primaryDark}
            borderColor={theme.color.primaryDark}
          />
        )}
      </TopContainer>
    )
  }

  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <title>Admin Panel</title>
      <body className={poppins.className}>
        <>
          {renderTopBar()}
          <DrawerNav open={open} setOpen={setOpen} />
          <Modal isOpen={showModal} onClose={onCloseModal}>
            <Login onCloseModal={onCloseModal} />
          </Modal>
          <Container open={open && !isMobile}>{children}</Container>
        </>
      </body>
    </html>
  )
}

const Container = styled('div')<{open: boolean}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-right: 20px;
  padding-left: ${({open}) => (open ? '200px' : '80px')};
  min-height: 100vh;
  background-color: ${theme.color.background};
  box-sizing: border-box;
`
const TopContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  min-height: 50px;
  position: sticky;
  box-sizing: border-box;
`

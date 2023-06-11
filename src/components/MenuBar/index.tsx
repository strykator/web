import React, {useState} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {Link, Typography, Box} from '@mui/material'
import {styled} from '@mui/material/styles'
import Button from '@/components/Button'
import {menu} from '@/constants'
import useResponsive from '@/hooks/useResponsive'
import Modal from '@/components/Modal'
import MobileMenu from './MobileMenu'
import Login from './Login'
import {selectUserUid} from '@/redux/user/userSlice'
import {RootState} from '@/redux'
import UserMenu from './UserMenu'
import {theme} from '@/theme'

const MenuBar = () => {
  const router = useRouter()
  const {isMobile} = useResponsive()
  const [isOpenModal, setOpenModal] = useState<boolean>(false)
  const state = useSelector((state: RootState) => state)
  const dispatch = useDispatch()
  const userId = selectUserUid(state)
  const handleCloseModal = () => setOpenModal(false)

  return (
    <Container isMobile={isMobile}>
      <Left>{isMobile ? <MobileMenu /> : null}</Left>
      <Middle>
        {!isMobile
          ? menu.map(item => (
              <CustomLink href={item.path} underline="hover" key={item.key}>
                <Text variant="h6">{item.label}</Text>
              </CustomLink>
            ))
          : null}
      </Middle>
      <Right>
        {userId ? (
          <UserMenu />
        ) : (
          <Button
            title="Account"
            width="70px"
            height="30px"
            onClick={() => setOpenModal(true)}
          />
        )}
      </Right>
      <Modal isOpen={isOpenModal} onClose={handleCloseModal}>
        <Login onCloseModal={handleCloseModal} />
      </Modal>
    </Container>
  )
}

const Container = styled(Box)<{isMobile: Boolean}>`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 60px;
  background-color: ${({isMobile}) =>
    isMobile ? theme.color.menu : 'transparent'};
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

export const Text = styled(Typography)<{isMobile?: Boolean}>`
  font-weight: 400;
  font-size: 14px;
  color: ${({isMobile}) =>
    isMobile ? theme.color.primaryDark : theme.color.menu};
`

export const CustomLink = styled(Link)`
  &:hover {
    text-decoration-color: ${theme.color.menu};
  }
`

export default MenuBar

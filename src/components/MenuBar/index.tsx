import React, {useState} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {
  Link,
  Typography,
  Box,
  Badge,
  BadgeProps,
  IconButton,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import {styled} from '@mui/material/styles'
import Button from '@/components/Button'
import {menu} from '@/constants'
import useResponsive from '@/hooks/useResponsive'
import Modal from '@/components/Modal'
import MobileMenu from './MobileMenu'
import Login from './Login'
import {selectUserUid} from '@/redux/user/userSlice'
import {selectTotalQuantity, selectEntityId} from '@/redux/cart/cartSlice'
import {RootState} from '@/redux'
import UserMenu from './UserMenu'
import {theme} from '@/theme'

interface IMenuBar {
  bgColor?: string
  textColor?: string
  sticky?: boolean
}

const MenuBar = ({bgColor, textColor, sticky}: IMenuBar) => {
  const router = useRouter()
  const {isMobile} = useResponsive()
  const [isOpenModal, setOpenModal] = useState<boolean>(false)
  const state = useSelector((state: RootState) => state)
  const dispatch = useDispatch()
  const userId = selectUserUid(state)
  const restaurantId = selectEntityId(state)
  const totalShoppingCartQuantity = selectTotalQuantity(state)
  const handleCloseModal = () => setOpenModal(false)

  const renderShoppingCart = () => {
    const gotoRestaurantDetail = () =>
      router.push(`/restaurants/${restaurantId}`)
    return totalShoppingCartQuantity !== 0 ? (
      <IconButton aria-label="cart" onClick={gotoRestaurantDetail}>
        <CustomBadge badgeContent={totalShoppingCartQuantity}>
          <ShoppingCart />
        </CustomBadge>
      </IconButton>
    ) : null
  }

  const renderRight = () => {
    return userId ? (
      <>
        {renderShoppingCart()}
        <UserMenu />
      </>
    ) : (
      <>
        {renderShoppingCart()}
        <Button
          title="Account"
          width="70px"
          height="30px"
          type="outlined"
          onClick={() => setOpenModal(true)}
          titleColor={
            isMobile || textColor ? theme.color.primaryDark : theme.color.menu
          }
          borderColor={
            isMobile || textColor ? theme.color.primaryDark : theme.color.menu
          }
        />
      </>
    )
  }

  return (
    <Container sticky={sticky} bgColor={bgColor} isMobile={isMobile}>
      <Left>
        {isMobile ? (
          <MobileMenu bgColor={bgColor} textColor={textColor} />
        ) : null}
      </Left>
      <Middle>
        {!isMobile
          ? menu.map(item => (
              <CustomLink
                href={item.path}
                textColor={textColor}
                underline="hover"
                key={item.key}>
                <Text textColor={textColor} variant="h6">
                  {item.label}
                </Text>
              </CustomLink>
            ))
          : null}
      </Middle>
      <Right>{renderRight()}</Right>
      <Modal isOpen={isOpenModal} onClose={handleCloseModal}>
        <Login onCloseModal={handleCloseModal} />
      </Modal>
    </Container>
  )
}

const Container = styled(Box)<{
  isMobile: Boolean
  bgColor?: string
  sticky?: boolean
}>`
  position: ${({sticky}) => (sticky ? 'sticky' : 'absolute')};
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 60px;
  opacity: ${({isMobile}) => (isMobile ? 0.85 : 1)};
  background-color: ${({isMobile, bgColor}) => {
    if (bgColor) {
      return bgColor
    } else if (isMobile) {
      return theme.color.menu
    } else {
      return 'transparent'
    }
  }};
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
export const Text = styled(Typography)<{
  isMobile?: Boolean
  textColor?: string
}>`
  font-weight: 400;
  font-size: 14px;
  color: ${({isMobile, textColor}) => {
    if (textColor) {
      return textColor
    } else if (isMobile) {
      return theme.color.primaryDark
    } else {
      return theme.color.menu
    }
  }};
`
export const CustomLink = styled(Link)<{textColor?: string}>`
  &:hover {
    text-decoration-color: ${({textColor}) =>
      textColor ? textColor : theme.color.menu};
  }
`
const CustomBadge = styled(Badge)`
  & .MuiBadge-badge {
    top: 3px;
    padding: '0 4px';
    background-color: ${theme.color.success};
    color: ${theme.color.background};
  }
`
const ShoppingCart = styled(ShoppingCartIcon)`
  width: 28px;
  height: 28px;
  color: red;
`

export default MenuBar

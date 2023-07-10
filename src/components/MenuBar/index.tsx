import React, {useState} from 'react'
import {useRouter, usePathname} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {Link, Typography, Box, Badge, IconButton} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import {ArrowBack} from '@mui/icons-material'
import {styled} from '@mui/material/styles'
import Button from '@/components/Button'
import {menu} from '@/constants'
import useResponsive from '@/hooks/useResponsive'
import Modal from '@/components/Modal'
import MobileMenu from './MobileMenu'
import Login from './Login'
import {selectUserUid} from '@/redux/user/userSlice'
import {
  selectTotalQuantity,
  selectEntityId,
  selectShowShoppingCart,
  toggleShowShoppingCart,
} from '@/redux/cart/cartSlice'
import {RootState} from '@/redux'
import UserMenu from './UserMenu'
import {theme} from '@/theme'

interface IMenuBar {
  bgColor?: string
  textColor?: string
  sticky?: boolean
  showBackIcon?: boolean
}

export default function MenuBar({
  bgColor,
  textColor,
  sticky,
  showBackIcon,
}: IMenuBar) {
  const router = useRouter()
  const pathName = usePathname()
  const {isMobile} = useResponsive()
  const [isOpenModal, setOpenModal] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  const state = useSelector((state: RootState) => state)
  const dispatch = useDispatch()
  const userId = selectUserUid(state)
  const restaurantId = selectEntityId(state)
  const shouldShowShoppingCart = selectShowShoppingCart(state)
  const totalShoppingCartQuantity = selectTotalQuantity(state)
  const handleCloseModal = () => setOpenModal(false)

  const renderShoppingCart = () => {
    const toggleShoppingCart = () => dispatch(toggleShowShoppingCart(true))
    return totalShoppingCartQuantity !== 0 && !showBackIcon ? (
      <IconButton aria-label="cart" onClick={toggleShoppingCart}>
        <CustomBadge badgeContent={totalShoppingCartQuantity}>
          <ShoppingCart />
        </CustomBadge>
      </IconButton>
    ) : null
  }

  const renderLeft = () => {
    const renderContent = () => {
      if (showBackIcon) {
        return (
          <IconButton onClick={() => router.back()}>
            <BackIcon />
            <BackText>Back</BackText>
          </IconButton>
        )
      } else if (isMobile) {
        return <MobileMenu bgColor={bgColor} textColor={textColor} />
      } else {
        return null
      }
    }
    return <Left isMobile={isMobile}>{renderContent()}</Left>
  }

  const renderMiddle = () => {
    return (
      !isMobile && (
        <Middle>
          {!showBackIcon &&
            menu.map(item => (
              <CustomLink
                href={item.path}
                textColor={textColor}
                underline="hover"
                key={item.key}>
                <Text textColor={textColor} variant="h6">
                  {item.label}
                </Text>
              </CustomLink>
            ))}
        </Middle>
      )
    )
  }

  const renderRight = () => {
    return (
      <Right isMobile={isMobile}>
        {userId ? (
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
                isMobile || textColor
                  ? theme.color.primaryDark
                  : theme.color.menu
              }
              borderColor={
                isMobile || textColor
                  ? theme.color.primaryDark
                  : theme.color.menu
              }
            />
          </>
        )}
      </Right>
    )
  }

  return (
    <Container
      sticky={sticky}
      bgColor={bgColor}
      isMobile={isMobile}
      shadow={Boolean(!showBackIcon)}>
      {renderLeft()}
      {renderMiddle()}
      {renderRight()}
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
  shadow: boolean
}>`
  position: ${({sticky}) => (sticky ? 'sticky' : 'absolute')};
  left: 0;
  top: 0;
  z-index: 3;
  display: flex;
  flex-direction: row;
  justify-content: ${({isMobile}) => (isMobile ? 'space-evenly' : 'center')};
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
  box-shadow: ${({shadow}) =>
    shadow ? '0px 2px 6px rgba(0, 0, 0, 0.1)' : 'none'};
`

const Left = styled('div')<{isMobile?: boolean}>`
  display: flex;
  justify-content: ${({isMobile}) => (isMobile ? 'flex-start' : 'center')};
  align-items: center;
  width: ${({isMobile}) => (isMobile ? '42%' : '25%')};
`

const Middle = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  gap: 15px;
`

const Right = styled('div')<{isMobile?: boolean}>`
  display: flex;
  flex-direction: row;
  justify-content: ${({isMobile}) => (isMobile ? 'flex-end' : 'center')};
  align-items: center;
  width: ${({isMobile}) => (isMobile ? '42%' : '25%')};
  gap: 10px;
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
const BackIcon = styled(ArrowBack)`
  color: ${theme.color.primaryDark};
  margin-right: 5px;
`
const BackText = styled(Typography)`
  font-weight: 400;
  font-size: ${theme.font.size.s};
  color: ${theme.color.textWeak};
`

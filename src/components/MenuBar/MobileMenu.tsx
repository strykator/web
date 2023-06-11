import React, {useState} from 'react'
//import styled from 'styled-components'
import {styled} from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import ClearIcon from '@mui/icons-material/Clear'
import {IconButton} from '@mui/material'
import {menu} from '@/constants'
import {CustomLink, Text} from './'
import {theme} from '@/theme'

const MobileMenu = () => {
  const [isOpen, setOpen] = useState(false)
  return (
    <Container>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{mr: 2}}
        onClick={() => setOpen(!isOpen)}>
        {isOpen ? <ClearIcon /> : <MenuIcon />}
      </IconButton>
      <MenuItemContainer isOpen={isOpen}>
        {menu.map(item => (
          <CustomLink href={item.path} underline="hover" key={item.key}>
            <Text isMobile variant="h6">
              {item.label}
            </Text>
          </CustomLink>
        ))}
      </MenuItemContainer>
    </Container>
  )
}

const Container = styled('div')`
  display: auto;
`

const MenuItemContainer = styled('div')<{isOpen: Boolean}>`
  display: flex;
  flex-direction: column;
  opacity: ${({isOpen}) => (isOpen ? 1 : 0.5)};
  transform: ${({isOpen}) => (isOpen ? 'translateY(0%)' : 'translateY(-200%)')};
  position: absolute;
  left: 0;
  width: 100%;
  gap: 10px;
  padding: 10px 0px 10px 40px;
  background-color: ${theme.color.menu};
  transition: opacity 1.5s ease, transform 0.5s ease; /* Add a smooth transition */
`

export default MobileMenu

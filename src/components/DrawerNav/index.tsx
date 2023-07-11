'use client'

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {
  Drawer as MuiDrawer,
  List as MuiList,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Backdrop,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Box,
  Typography,
  Rating,
  Stack,
} from '@mui/material'
import {
  Mail,
  Inbox,
  Menu,
  ChevronLeft,
  ChevronRight,
  KeyboardDoubleArrowRight,
  KeyboardDoubleArrowLeft,
  ExpandMore,
  AssignmentInd,
  ShoppingCart,
  RadioButtonUnchecked,
  Circle,
  MenuBook,
  PriorityHighRounded,
} from '@mui/icons-material'
import {useRouter, usePathname} from 'next/navigation'
import {theme} from '@/theme'
import {useResponsive} from '@/hooks'

const menu = [
  {
    key: 'user',
    title: 'User',
    subMenu: [
      {
        key: 'user-profile',
        subTitle: 'Profile',
      },
      {
        key: 'user-list',
        subTitle: 'List',
      },
      {
        key: 'user-create',
        subTitle: 'Create',
      },
      {
        key: 'user-edit',
        subTitle: 'Edit',
      },
    ],
  },
  {
    key: 'menu',
    title: 'Menu',
    subMenu: [
      {
        key: 'menu-list',
        subTitle: 'List',
      },
      {
        key: 'menu-details',
        subTitle: 'Details',
      },
      {
        key: 'menu-create',
        subTitle: 'Create',
      },
      {
        key: 'menu-edit',
        subTitle: 'Edit',
      },
    ],
  },
  {
    key: 'order',
    title: 'Order',
    subMenu: [
      {
        key: 'order-list',
        subTitle: 'List',
      },
      {
        key: 'order-details',
        subTitle: 'Details',
      },
      {
        key: 'order-create',
        subTitle: 'Create',
      },
      {
        key: 'order-edit',
        subTitle: 'Edit',
      },
    ],
  },
]

interface IDrawerNav {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function DrawerNav({open, setOpen}: IDrawerNav) {
  const {isMobile} = useResponsive()
  const [selected, setSelected] = useState<string>('')
  const [selectedSubMenu, setSelectedSubMenu] = useState<string>('')

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const onSelectMenuItem = (item: string) => {
    setSelected(item)
  }
  const onSelectSubMenuItem = (item: string) => {
    setSelectedSubMenu(item)
  }
  return (
    <>
      <Drawer variant="permanent" anchor="left" open={open}>
        <ListItemButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={toggleDrawer}
          sx={{
            maxHeight: 48,
            justifyContent: open ? 'flex-end' : 'center',
            px: 2.5,
          }}>
          {open ? <KeyboardDoubleArrowLeft /> : <KeyboardDoubleArrowRight />}
        </ListItemButton>
        <Divider />
        <List>
          {menu.map((item: any, index: number) => {
            return (
              <>
                <ListItemButton
                  key={item + index}
                  onClick={() => onSelectMenuItem(item.title)}
                  selected={selected === item.title}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                    }}>
                    {index === 0 && <AssignmentInd />}
                    {index === 1 && <MenuBook />}
                    {index === 2 && <ShoppingCart />}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.title} />}
                  {open && (
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        ml: 3,
                        justifyContent: 'flex-end',
                      }}>
                      <ChevronRight />
                    </ListItemIcon>
                  )}
                </ListItemButton>
                {selected === item.title && open && (
                  <SubList>
                    {item.subMenu.map((subItem: any) => (
                      <ListItemButton
                        key={subItem.key}
                        onClick={() => onSelectSubMenuItem(subItem.key)}
                        selected={selectedSubMenu === subItem.key}
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? 'initial' : 'center',
                          ml: open ? 3 : 0,
                          px: 1,
                        }}>
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 1 : 'auto',
                            justifyContent: 'center',
                          }}>
                          {<StyledDot />}
                        </ListItemIcon>
                        {open && <ListItemText primary={subItem.subTitle} />}
                      </ListItemButton>
                    ))}
                  </SubList>
                )}
              </>
            )
          })}
        </List>
      </Drawer>
      <Backdrop
        sx={{zIndex: theme => theme.zIndex.drawer - 1}}
        open={open && isMobile}
        onClick={toggleDrawer}></Backdrop>
    </>
  )
}

const Drawer = styled(MuiDrawer)<{open: boolean}>`
  display: flex;
  justify-content: center;
  align-items: center;
  & .MuiDrawer-paper {
    width: ${({open}) => (open ? 'auto' : '60px')};
    background-color: ${theme.color.background};
  }
`
const List = styled(MuiList)({
  // selected state
  '&& .Mui-selected': {
    backgroundColor: 'rgba(214,241,232,0.5)',
    '&, & .MuiListItemIcon-root': {
      color: 'rgba(0,167,111,0.8)',
    },
  },
  // hover state
  '&& .Mui-selected:hover': {
    backgroundColor: '#D6F1E8',
    '&, & .MuiListItemIcon-root': {
      color: '#00A76F',
    },
  },
})
const SubList = styled(MuiList)({
  // selected state
  '&& .Mui-selected': {
    backgroundColor: 'transparent',
    '&, & .MuiListItemIcon-root': {
      color: 'rgba(0,167,111,0.8)',
    },
  },
  // hover state
  '&& .Mui-selected:hover': {
    backgroundColor: '#D6F1E8',
    '&, & .MuiListItemIcon-root': {
      color: '#00A76F',
    },
  },
})
const StyledDot = styled(Circle)`
  width: 10px;
  height: 10px;
`
const Text = styled(Typography)`
  color: ${theme.color.text};
  font-size: ${theme.font.size.s};
`

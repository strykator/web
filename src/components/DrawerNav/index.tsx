'use client'

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useRouter, usePathname} from 'next/navigation'
import {
  Drawer as MuiDrawer,
  List as MuiList,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Backdrop,
  Divider,
  Typography,
  Collapse,
} from '@mui/material'
import {
  KeyboardDoubleArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardArrowDown,
  KeyboardArrowRight,
  AssignmentInd,
  ShoppingCart,
  Circle,
  MenuBook,
  Category,
} from '@mui/icons-material'
import {theme} from '@/theme'
import {useResponsive} from '@/hooks'

const menu = [
  {
    key: 'user',
    title: 'User',
    subMenu: [
      {
        key: 'user-list',
        subTitle: 'List',
      },
      {
        key: 'user-create',
        subTitle: 'Create',
      },
    ],
  },
  {
    key: 'product',
    title: 'Product',
    subMenu: [
      {
        key: 'product-list',
        subTitle: 'List',
      },
      {
        key: 'product-create',
        subTitle: 'Create',
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
    ],
  },
]

interface IDrawerNav {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function DrawerNav({open, setOpen}: IDrawerNav) {
  const router = useRouter()
  const pathName = usePathname()
  const {isMobile} = useResponsive()
  const [selected, setSelected] = useState<string>('')
  const [selectedSubMenu, setSelectedSubMenu] = useState<string>('')
  const [expandedList, setExpandedList] = useState<string[]>([])

  useEffect(() => {
    const patternList = /\/admin\/order$/
    const patternDetails = /\/admin\/order\/\[\w+\]$/
    if (patternList.test(pathName)) {
    } else {
    }
  }, [pathName])

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const onSelectMenuItem = (itemKey: string) => {
    if (itemKey === 'order-list') {
      setSelected('order')
      router.replace('/admin/order')
      setSelectedSubMenu('order-list')
    } else if (itemKey === 'product-list') {
      setSelected('product')
      router.replace('/admin/product')
      setSelectedSubMenu('product-list')
    } else if (itemKey === 'product-create') {
      setSelected('product')
      router.replace('/admin/product/create')
      setSelectedSubMenu('product-create')
    } else if (itemKey === 'user-list') {
      setSelected('user')
      //router.replace('/admin/user')
      setSelectedSubMenu('user-list')
    } else if (itemKey === 'user-create') {
      setSelected('user')
      //router.replace('/admin/user/create')
      setSelectedSubMenu('user-create')
    }

    if (expandedList.includes(itemKey)) {
      setExpandedList(expandedList.filter((key: string) => key !== itemKey))
    } else {
      setExpandedList([...expandedList, itemKey])
    }
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
                  onClick={() => onSelectMenuItem(item.key)}
                  selected={selected === item.key}
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
                    {index === 1 && <Category />}
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
                      {expandedList.includes(item.key) ? (
                        <KeyboardArrowDown fontSize="medium" />
                      ) : (
                        <KeyboardArrowRight fontSize="medium" />
                      )}
                    </ListItemIcon>
                  )}
                </ListItemButton>
                <Collapse
                  in={expandedList.includes(item.key) && open}
                  timeout="auto"
                  unmountOnExit>
                  <SubList>
                    {item.subMenu.map((subItem: any) => (
                      <ListItemButton
                        key={subItem.key}
                        onClick={() => onSelectMenuItem(subItem.key)}
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
                </Collapse>
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
  width: 7px;
  height: 7px;
`
const Text = styled(Typography)`
  color: ${theme.color.text};
  font-size: ${theme.font.size.s};
`

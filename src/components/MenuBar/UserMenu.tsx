import React from 'react'
import styled from 'styled-components'
import {
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Typography,
} from '@mui/material'
import {useRouter} from 'next/navigation'
import LogoutIcon from '@mui/icons-material/Logout'
import {useDispatch} from 'react-redux'
import {resetUser} from '@/redux/user/userSlice'
import {theme} from '@/theme'
import {Logout} from '@/libs/firebase'

const paperXs = {
  overflow: 'visible',
  filter: 'drop-shadow(0px 2px 5px rgba(0,0,0,0.32))',
  mt: 0.5,
  width: 150,
  '& .MuiAvatar-root': {
    width: 24,
    height: 24,
    ml: -0.5,
    mr: 2,
  },
  '& .MuiMenuItem-root:hover': {
    backgroundColor: theme.color.menu,
  },
  '&:before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    right: 20,
    width: 10,
    height: 10,
    bgcolor: 'background.paper',
    transform: 'translateY(-50%) rotate(45deg)',
    zIndex: 0,
  },
}

const UserMenu = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleLogout = async () => {
    const isLoggedOut = await Logout()
    if (isLoggedOut) {
      dispatch(resetUser())
    }
    handleClose()
  }

  const onClickProfile = () => {
    router.push('/profile')
    handleClose()
  }

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton aria-label="Avatar" onClick={handleClick}>
          <Avatar sx={{bgcolor: '#191970'}} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: paperXs,
        }}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
        <MenuItem onClick={onClickProfile}>
          <Avatar /> <Text>Profile</Text>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Text>Logout</Text>
        </MenuItem>
      </Menu>
    </>
  )
}

const Text = styled(Typography)`
  font-size: ${theme.font.size.m};
  color: ${theme.color.text};
`

export default UserMenu

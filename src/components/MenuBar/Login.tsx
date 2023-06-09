import React, {useState} from 'react'
import styled from 'styled-components'
import {
  Typography,
  FilledInput,
  InputAdornment,
  IconButton,
  InputLabel,
  FormControl,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Button from '@/components/Button'

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false)

  const handleClickShowPassword = () => setShowPassword(show => !show)
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  return (
    <Container>
      <Title>Login</Title>
      <FormControl sx={{m: 1, width: '25ch'}} variant="filled">
        <InputLabel htmlFor="filled-adornment-password">Email</InputLabel>
        <FilledInput id="filled-adornment-password" type="text" />
      </FormControl>
      <FormControl sx={{m: 1, width: '25ch'}} variant="filled">
        <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
        <FilledInput
          id="filled-adornment-password"
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Space />
      <Button
        title="Submit"
        onClick={() => alert()}
        width="47%"
        height="36px"
      />
    </Container>
  )
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Title = styled(Typography)`
  font-size: ${({theme}) => theme.font.size.xl};
  font-weight: 600;
  margin-bottom: 20px;
`
const Space = styled('div')`
  height: 10px;
`

export default Login

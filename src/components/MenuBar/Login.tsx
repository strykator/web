import React, {useState, ChangeEvent} from 'react'
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

interface ILogin {
  onCloseModal: () => void
}

const Login = ({onCloseModal}: ILogin) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const handleClickShowPassword = () => setShowPassword(show => !show)
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }
  const handleEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target?.value)
  }
  const handlePasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target?.value)
  }
  const handleSubmit = () => {
    alert(`email: ${email} - password: ${password}`)
    onCloseModal && onCloseModal()
  }

  return (
    <Container>
      <Title>Login</Title>
      <FormControl sx={{m: 1, width: '25ch'}} variant="filled">
        <InputLabel htmlFor="filled-adornment-password">Email</InputLabel>
        <FilledInput
          id="filled-adornment-password"
          type="text"
          value={email}
          onChange={handleEmailInput}
        />
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
          value={password}
          onChange={handlePasswordInput}
        />
      </FormControl>
      <Space />
      <Button title="Submit" onClick={handleSubmit} width="47%" height="36px" />
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

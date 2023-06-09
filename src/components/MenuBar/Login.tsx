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
import {useDispatch, useSelector} from 'react-redux'
import Button from '@/components/Button'
import {loginWithEmailAndPassword} from '@/libs/firebase'
import {buildUserPayload} from './utils'
import {selectUserUid, updateUser} from '@/redux/user/userSlice'

interface ILogin {
  onCloseModal: () => void
}

const Login = ({onCloseModal}: ILogin) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const dispatch = useDispatch()

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
  const handleSubmit = async () => {
    onCloseModal && onCloseModal()
    const user = await loginWithEmailAndPassword(email, password)
    if (user) {
      const payload = buildUserPayload(user)
      dispatch(updateUser(payload))
    }
  }

  return (
    <Container>
      <Title>Login</Title>
      <FormControl sx={{m: 1, width: '50%'}} variant="filled">
        <InputLabel htmlFor="filled-adornment-password">Email</InputLabel>
        <FilledInput
          id="filled-adornment-email"
          type="text"
          value={email}
          onChange={handleEmailInput}
        />
      </FormControl>
      <FormControl sx={{m: 1, width: '50%'}} variant="filled">
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
      <Button
        title="Submit"
        onClick={handleSubmit}
        width="50%"
        height="40px"
        disabled={!email || !password}
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

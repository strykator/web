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
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<boolean>(false)
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
    const user = await loginWithEmailAndPassword(email, password)
    if (user) {
      setError(false)
      const payload = buildUserPayload(user)
      dispatch(updateUser(payload))
      onCloseModal && onCloseModal()
    } else {
      setError(true)
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
          error={error}
        />
        {error ? <ErrorMessage>Invalid Input</ErrorMessage> : null}
      </FormControl>
      <FormControl sx={{m: 1, width: '50%'}} variant="filled">
        <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
        <FilledInput
          id="filled-adornment-password"
          type={showPassword ? 'text' : 'password'}
          error={error}
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
        {error ? <ErrorMessage>Invalid Input</ErrorMessage> : null}
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
const ErrorMessage = styled(Typography)`
  font-size: ${({theme}) => theme.font.size.s};
  color: ${({theme}) => theme.color.error};
  font-weight: 400;
  margin-bottom: 5px;
  margin-top: 5px;
`

export default Login

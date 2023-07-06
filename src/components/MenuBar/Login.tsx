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
import {useForm, Controller, SubmitHandler} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import Button from '@/components/Button'
import ErrorMessage from '@/components/ErrorMessage'
import {loginWithEmailAndPassword} from '@/libs/firebase'
import {buildUserPayload} from './utils'
import {updateUser} from '@/redux/user/userSlice'

interface IFormInput {
  email: string
  password: string
}

interface ILogin {
  onCloseModal: () => void
}

const Login = ({onCloseModal}: ILogin) => {
  const [showPassword, setShowPassword] = useState(false)
  const {
    control,
    trigger,
    clearErrors,
    setError,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm<IFormInput>({
    defaultValues: {
      email: 'test@test.com',
      password: 'test1234',
    },
  })
  const {email, password} = getValues()
  const dispatch = useDispatch()

  const handleClickShowPassword = () => setShowPassword(show => !show)
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    const {email, password} = data
    const user = await loginWithEmailAndPassword(email, password)
    if (user) {
      const payload = user
      dispatch(updateUser(payload))
      onCloseModal && onCloseModal()
    } else {
      setError('root.serverError', {message: 'Invalid Input'})
    }
  }

  return (
    <Container>
      <Title>Login</Title>
      <FormControl sx={{m: 1, width: '50%'}} variant="filled">
        <InputLabel htmlFor="filled-adornment-password">Email</InputLabel>
        <Controller
          name="email"
          control={control}
          render={({field}) => (
            <FilledInput
              {...field}
              onBlur={() => trigger('email')}
              onFocus={() => clearErrors()}
              type="text"
              error={!!errors.email}
            />
          )}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
        />
        {errors.email && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
        {errors.root && (
          <ErrorMessage>{errors.root?.serverError?.message}</ErrorMessage>
        )}
      </FormControl>
      <FormControl sx={{m: 1, width: '50%'}} variant="filled">
        <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
        <Controller
          name="password"
          control={control}
          render={({field}) => (
            <FilledInput
              {...field}
              onBlur={() => trigger('password')}
              onFocus={() => clearErrors()}
              type={showPassword ? 'text' : 'password'}
              error={!!errors.password}
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
          )}
          rules={{
            required: 'Password is required',
            pattern: {
              value: /^(?=.{8,})\S+$/i,
              message: 'Invalid Password - Atleast 8 characters',
            },
          }}
        />
        {errors.password && (
          <ErrorMessage>{errors.password?.message}</ErrorMessage>
        )}
        {errors.root && (
          <ErrorMessage>{errors.root?.serverError?.message}</ErrorMessage>
        )}
      </FormControl>
      <Space />
      <Button
        title="Submit"
        onClick={handleSubmit(onSubmit)}
        width="50%"
        height={40}
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
  width: 100%;
  height: 10px;
`

export default Login

'use client'

import React, {useState} from 'react'
import styled from 'styled-components'
import {
  Paper,
  TextField,
  Grid,
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {useRouter} from 'next/navigation'
import {theme} from '@/theme'
import MenuBar from '@/components/MenuBar'
import Image from '@/components/Image'
import Button from '@/components/Button'
import mailBox from '@/assets/images/mail_box.png'

const fieldIds = {
  name: 'name-outlined-basic',
  email: 'email-outlined-basic',
  phone: 'phone-outlined-basic',
  message: 'message-outlined-basic',
}

export default function Page() {
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.id) {
      case fieldIds['name']:
        setName(event.target.value)
        break
      case fieldIds['email']:
        setEmail(event.target.value)
        break
      case fieldIds['phone']:
        setPhone(event.target.value)
        break
      case fieldIds['message']:
        setMessage(event.target.value)
      default:
        break
    }
  }

  const handleSendMsg = () => {
    alert(`${name} - ${email} - ${phone} - ${message}`)
  }

  return (
    <>
      <MenuBar
        bgColor={theme.color.menu}
        textColor={theme.color.primaryDark}
        sticky
      />
      <Container>
        <Card elevation={5}>
          <Grid container md={4} p={1} justifyContent={'center'}>
            <Grid item xs={12} pt={3} pl={2} md={12}>
              <IconButton onClick={() => router.back()}>
                <BackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} md={12} height={220}>
              <Image src={mailBox} alt="mail-box" type="contain" />
            </Grid>
          </Grid>
          <Grid container md={8} p={2} spacing={2}>
            <Grid item xs={12} md={12}>
              <CustomTextField
                id="name-outlined-basic"
                label="Name"
                variant="standard"
                defaultValue={name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <CustomTextField
                id="email-outlined-basic"
                label="Email"
                variant="standard"
                defaultValue={email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <CustomTextField
                id="phone-outlined-basic"
                label="Phone"
                variant="standard"
                defaultValue={phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <MultilineTextField
                id="message-outlined-basic"
                label="Message"
                variant="outlined"
                defaultValue={message}
                onChange={handleChange}
                multiline
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Button
                title="Send Message"
                onClick={handleSendMsg}
                width="140px"
                height="40px"
              />
            </Grid>
          </Grid>
        </Card>
      </Container>
    </>
  )
}

const Container = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10vh;
  width: 100%;
`
const Text = styled(Typography)`
  line-height: 20px;
  font-size: ${theme.font.size.m};
  color: ${theme.color.text};
`
const CustomTextField = styled(TextField)`
  display: flex;
  width: 100%;
  border-radius: 5px;
  & .MuiInputBase-root {
    height: 40px;
  }
`
const MultilineTextField = styled(TextField)`
  display: flex;
  width: 100%;
  border-radius: 5px;
  & .MuiInputBase-root {
    min-height: 100px;
    height: 100%;
  }
`
const Card = styled(Paper)`
  display: flex;
  flex-direction: row;
  width: 60%;
  max-width: 700px;
  min-width: 350px;
`
const BackIcon = styled(ArrowBackIcon)`
  color: ${theme.color.primaryDark};
`

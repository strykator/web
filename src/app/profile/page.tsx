'use client'

import React, {useState} from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {Paper, TextField, Grid, Box} from '@mui/material'
import {theme} from '@/theme'
import profileCover from '@/assets/images/profile_cover.jpg'
import maleAvatar from '@/assets/images/3d_male_avatar.png'
import Button from '@/components/Button'

const fieldIds = {
  name: 'name-outlined-basic',
  email: 'email-outlined-basic',
  phone: 'phone-outlined-basic',
  address: 'address-outlined-basic',
  country: 'country-outlined-basic',
  state: 'state-outlined-basic',
  city: 'city-outlined-basic',
  zipcode: 'zipcode-outlined-basic',
  about: 'about-outlined-basic',
}

const Profile = () => {
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [country, setCountry] = useState<string>('')
  const [state, setState] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [zipcode, setZipcode] = useState<string>('')
  const [about, setAbout] = useState<string>('')

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
      case fieldIds['address']:
        setAddress(event.target.value)
        break
      case fieldIds['country']:
        setCountry(event.target.value)
        break
      case fieldIds['state']:
        setState(event.target.value)
        break
      case fieldIds['city']:
        setCity(event.target.value)
        break
      case fieldIds['zipcode']:
        setZipcode(event.target.value)
        break
      case fieldIds['about']:
        setAbout(event.target.value)
        break
      default:
        break
    }
  }

  const handleSave = () => {
    alert(
      `${name}-${email}-${phone}-${address}-${country}-${state}-${city}-${zipcode}-${about}`,
    )
  }

  const handleBack = () => router.back()

  return (
    <Container>
      <Banner>
        <BannerTop src={profileCover} alt="Cover" />
        <Avatar src={maleAvatar} alt="Cover" />
      </Banner>
      <Body elevation={3}>
        <Box p={3} sx={{flexGrow: 1}}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomTextField
                id="name-outlined-basic"
                label="Name"
                variant="outlined"
                defaultValue={name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                id="email-outlined-basic"
                label="Email"
                variant="outlined"
                defaultValue={email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                id="phone-outlined-basic"
                label="Phone Number"
                variant="outlined"
                defaultValue={phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                id="address-outlined-basic"
                label="Address"
                variant="outlined"
                defaultValue={address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                id="country-outlined-basic"
                label="Country"
                variant="outlined"
                defaultValue={country}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                id="state-outlined-basic"
                label="State/Region"
                variant="outlined"
                defaultValue={state}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                id="city-outlined-basic"
                label="City"
                variant="outlined"
                defaultValue={city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                id="zipcode-outlined-basic"
                label="Zip Code"
                variant="outlined"
                defaultValue={zipcode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <MultilineTextField
                id="about-outlined-basic"
                label="About"
                variant="outlined"
                defaultValue={about}
                onChange={handleChange}
                multiline
              />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            flexDirection="row"
            marginTop={3}>
            <Button
              title="Back"
              onClick={handleBack}
              width="100px"
              height="40px"
            />
            <Button
              title="Save Changes"
              onClick={handleSave}
              width="140px"
              height="40px"
            />
          </Grid>
        </Box>
      </Body>
    </Container>
  )
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3% 6% 0% 6%;
`
const Banner = styled('div')`
  display: flex;
  flex-direction: column;
  height: 300px;
  width: 100%;
  border-radius: 20px;
  background-color: transparent;
`
const BannerTop = styled(Image)`
  height: 80%;
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  object-position: 75% 25%;
`
const Avatar = styled(Image)`
  margin-top: -80px;
  margin-left: 50px;
  height: 120px;
  width: 120px;
  border-radius: 60px;
  background-color: ${theme.color.avatarCover};
`
const Body = styled(Paper)`
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  background-color: ${theme.color.background};
  margin-bottom: 50px;
`
const CustomTextField = styled(TextField)`
  display: flex;
  width: 100%;
  border-radius: 5px;
  & .MuiInputBase-root {
    height: 50px;
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

export default Profile

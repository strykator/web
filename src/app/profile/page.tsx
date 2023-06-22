'use client'

import React, {useState} from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {Paper, TextField, Grid, Box} from '@mui/material'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm, Controller, SubmitHandler} from 'react-hook-form'
import {theme} from '@/theme'
import profileCover from '@/assets/images/profile_cover.jpg'
import maleAvatar from '@/assets/images/3d_male_avatar.png'
import Button from '@/components/Button'
import {schemaFormProfile, formatPhoneInput, sanitizeData} from '@/utils'

interface IFormInput {
  name: string
  email: string
  phone: string
  address: string
  country: string
  state: string
  city: string
  zipcode: string
  about: string
}
const defaultFormValues = {
  name: '',
  email: '',
  phone: '',
  address: '',
  country: '',
  state: '',
  city: '',
  zipcode: '',
  about: '',
}

const Profile = () => {
  const router = useRouter()
  const {
    control,
    trigger,
    clearErrors,
    setError,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm<IFormInput>({
    defaultValues: defaultFormValues,
    resolver: yupResolver(schemaFormProfile),
  })

  const handleSave: SubmitHandler<IFormInput> = async data => {
    const sanitizedData = sanitizeData(data)
    const {name, email, phone, address, country, state, city, zipcode, about} =
      sanitizedData
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
              <Controller
                name="name"
                control={control}
                render={({field}) => (
                  <CustomTextField
                    {...field}
                    onBlur={() => trigger('name')}
                    variant="outlined"
                    label="Name"
                    error={!!errors.name}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                render={({field}) => (
                  <CustomTextField
                    {...field}
                    variant="outlined"
                    label="Email"
                    error={!!errors.email}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="phone"
                control={control}
                render={({field}) => (
                  <CustomTextField
                    {...field}
                    value={formatPhoneInput(field.value)}
                    onChange={e =>
                      field.onChange(
                        e.target.value.length <= 12
                          ? e.target.value
                          : field.value,
                      )
                    }
                    variant="outlined"
                    label="Phone Number"
                    error={!!errors.phone}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="address"
                control={control}
                render={({field}) => (
                  <CustomTextField
                    {...field}
                    variant="outlined"
                    label="Address"
                    error={!!errors.address}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="country"
                control={control}
                render={({field}) => (
                  <CustomTextField
                    {...field}
                    variant="outlined"
                    label="Country"
                    error={!!errors.country}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="state"
                control={control}
                render={({field}) => (
                  <CustomTextField
                    {...field}
                    variant="outlined"
                    label="State/Region"
                    error={!!errors.state}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="city"
                control={control}
                render={({field}) => (
                  <CustomTextField
                    {...field}
                    variant="outlined"
                    label="City"
                    error={!!errors.city}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="zipcode"
                control={control}
                render={({field}) => (
                  <CustomTextField
                    {...field}
                    variant="outlined"
                    label="Zip Code"
                    error={!!errors.zipcode}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                name="about"
                control={control}
                render={({field}) => (
                  <MultilineTextField
                    {...field}
                    variant="outlined"
                    label="About"
                    error={!!errors.about}
                    multiline
                  />
                )}
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
              onClick={handleSubmit(handleSave)}
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

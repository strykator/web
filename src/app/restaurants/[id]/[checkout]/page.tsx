'use client'

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useRouter, useSearchParams} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '@/redux'
import {
  Grid,
  Paper,
  Box,
  Typography,
  Link,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import {ArrowBack} from '@mui/icons-material'
import Button from '@/components/Button'
import {theme} from '@/theme'

export default function Checkout({params}: {params: {checkout: string}}) {
  const router = useRouter()
  const checkout = params.checkout
  const searchParams = useSearchParams()
  const [activeStep, setActiveStep] = useState<number>(0)

  const steps = ['Account Details', 'Shipping Details', 'Payment Details']

  const handleNextStep = () =>
    setActiveStep(activeStep < steps.length - 1 ? activeStep + 1 : activeStep)
  const handleBackStep = () =>
    setActiveStep(activeStep > 0 ? activeStep - 1 : activeStep)

  return (
    <>
      <TopBar>
        <IconButton onClick={() => router.back()}>
          <GoBackIcon />
          <SubTitle>Back</SubTitle>
        </IconButton>
      </TopBar>
      <Container>
        <Box sx={{width: '100%'}}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step active={index === activeStep} key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Header>
          <Title>Checkout</Title>
        </Header>
        <Body></Body>
        <Footer>
          <Button
            title="Back"
            type={activeStep !== 0 ? 'contained' : 'outlined'}
            disabled={activeStep === 0}
            onClick={handleBackStep}
          />
          <Button
            title={activeStep === 2 ? 'Finish' : 'Next'}
            type="contained"
            onClick={handleNextStep}
            backgroundColor={activeStep === 2 ? theme.color.success : 'auto'}
          />
        </Footer>
      </Container>
    </>
  )
}

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2%;
  padding-left: 15%;
  padding-right: 15%;
  box-sizing: border-box;
`
const TopBar = styled(Box)`
  display: flex;
  align-items: center;
  position: sticky;
  height: 60px;
  width: 100%;
  padding-left: 5%;
  background-color: transparent;
  box-sizing: border-box;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
`
const GoBackIcon = styled(ArrowBack)`
  color: ${theme.color.primaryDark};
  margin-right: 5px;
`
const Title = styled(Typography)`
  font-weight: 400;
  font-size: ${theme.font.size.m};
  color: ${theme.color.text};
`
const SubTitle = styled(Typography)`
  font-weight: 400;
  font-size: ${theme.font.size.s};
  color: ${theme.color.textWeak};
`
const Header = styled(Box)`
  height: 150px;
  width: 100%;
  background-color: green;
`
const Body = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 40vh;
  background-color: yellow;
`
const Footer = styled(Box)`
  display: flex;
  width: 100%;
  min-height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`

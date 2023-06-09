import React from 'react'
import styled, {keyframes} from 'styled-components'
import {Typography, Modal as MModal, IconButton} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {useResponsive} from '@/hooks'

interface IModal {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
  backdropClickDisabled?: boolean
}

const Modal = ({isOpen, onClose, children, backdropClickDisabled}: IModal) => {
  const {isMobile} = useResponsive()
  const handleClose = (event: object, reason: string) => {
    if (backdropClickDisabled) return
    onClose()
  }
  return (
    <ModalContainer
      open={isOpen}
      onClose={handleClose}
      sx={{
        '& .MuiModal-backdrop': {
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}>
      <Container isMobile={isMobile}>
        <Header>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Header>
        <Body>{children}</Body>
        <Footer />
      </Container>
    </ModalContainer>
  )
}
const zoomInDownAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-30%) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0%) scale(1);
  }
`

const ModalContainer = styled(MModal)`
  display: flex;
  align-items: center;
  justify-content: center;
`
const Container = styled('div')<{isMobile: boolean}>`
  display: flex;
  flex-direction: column;
  width: ${({isMobile}) => (isMobile ? '80%' : '50%')};
  height: 50%;
  background: linear-gradient(to bottom, #d4d3dd, #abbaab);
  border-radius: 4px;
  box-shadow: 24;
  animation: ${zoomInDownAnimation} 0.3s;
  transform-origin: top center;
`
const Header = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 99%;
  height: 50px;
`
const Body = styled('div')`
  display: flex;
  flex-direction: column;
`
const Footer = styled('div')`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 20px;
`

export default Modal

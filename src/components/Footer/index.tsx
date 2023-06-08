import React from 'react'
import styled from 'styled-components'
import {Link, Typography} from '@mui/material'

const Footer = () => {
  return (
    <Container>
      <Link underline="none">
        <Text variant="caption">Copyright © 2023 Feastta Inc.</Text>
      </Link>
      <CustomLink href="#" underline="hover">
        <Text variant="caption">Privacy</Text>
      </CustomLink>
      <CustomLink href="#" underline="hover">
        <Text variant="caption">Policy</Text>
      </CustomLink>
      <CustomLink href="#" underline="hover">
        <Text variant="caption">Terms of Use</Text>
      </CustomLink>
      <CustomLink href="#" underline="hover">
        <Text variant="caption">Legal</Text>
      </CustomLink>
      <CustomLink href="#" underline="hover">
        <Text variant="caption">Site Map</Text>
      </CustomLink>
    </Container>
  )
}

const Container = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
  max-height: 200px;
  min-height: 20px;
  padding: 5px 10px;
  background-color: transparent;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`

const Text = styled(Typography)`
  font-weight: 400;
  font-size: 11px;
  color: ${({theme}) => theme.color.text};
`

const CustomLink = styled(Link)`
  &:hover {
    text-decoration-color: ${({theme}) => theme.color.text};
  }
`

export default Footer

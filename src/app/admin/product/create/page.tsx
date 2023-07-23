'use client'

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useRouter, usePathname} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {
  Paper,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Divider,
  Stack,
  Tabs,
  Tab,
  Input,
  IconButton,
} from '@mui/material'
import {CloudUploadOutlined} from '@mui/icons-material'
import {theme} from '@/theme'
import {useResponsive} from '@/hooks'
import {RootState} from '@/redux'
import {selectUserUid} from '@/redux/user/userSlice'
import Button from '@/components/Button'
import {uploadImage} from '@/libs/firebase'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB in bytes

export default function ProductCreate() {
  const router = useRouter()
  const pathName = usePathname()
  const {isMobile} = useResponsive()
  const appState = useSelector((state: RootState) => state)
  const userId = selectUserUid(appState)
  const [selectedStatus, setSelectedStatus] = useState(1)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imgUrl, setImgUrl] = useState('')

  const handleFileChange = (event: any) => {
    console.log('File => ', event.target.files[0])
    setSelectedFile(event.target.files[0])
  }
  const onUpload = async () => {
    const url = await uploadImage(
      selectedFile,
      selectedFile?.name ?? 'temp.png',
    )
    setImgUrl(url)
    console.log('done => ', url)
  }
  function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault()
    console.info('You clicked a breadcrumb.')
  }
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/admin"
      onClick={handleClick}>
      Admin
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href="/admin/product"
      onClick={handleClick}>
      Product
    </Link>,
    <Typography key="3" color="text.primary">
      Create
    </Typography>,
  ]

  return (
    <Container>
      <Title>Create a new product</Title>
      <Stack spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
      <Body elevation={1}>
        <UploadFile type="file" onChange={handleFileChange} id="inputFile" />
        <Button
          title="upload"
          width={50}
          height={50}
          onClick={onUpload}
          disabled={!selectedFile}
        />
        <label htmlFor="inputFile">
          <IconButton component="span">
            <CloudUploadOutlined />
          </IconButton>
        </label>
      </Body>
    </Container>
  )
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 75px;
`
const Title = styled(Typography)`
  color: ${theme.color.text};
  font-size: ${theme.font.size.xl};
  font-family: ${theme.font.family};
  font-weight: 500;
`
const Body = styled(Paper)`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  width: 100%;
  padding: 20px;
  min-height: 40vh;
  flex-direction: column;
  box-sizing: border-box;
`

const Text = styled(Typography)`
  color: ${theme.color.text};
  font-size: ${theme.font.size.m};
  font-family: ${theme.font.family};
  font-weight: 400;
`
const UploadFile = styled(Input)`
  display: none;
`

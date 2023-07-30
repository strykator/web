'use client'

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useRouter, useSearchParams} from 'next/navigation'
import {useQuery} from '@tanstack/react-query'
import {useSelector} from 'react-redux'
import {useForm, Controller, SubmitHandler} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {
  Paper,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  TextField,
  Grid,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  Chip,
  FormControl,
  InputLabel,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  Stack,
  InputAdornment,
} from '@mui/material'
import {theme} from '@/theme'
import {useResponsive} from '@/hooks'
import {RootState} from '@/redux'
import {selectUserUid} from '@/redux/user/userSlice'
import Button from '@/components/Button'
import UploadFile, {IFile} from '@/components/UploadFile'
import {
  uploadImage,
  createProduct,
  updateProduct,
  getProductById,
} from '@/libs/firebase'
import {schemaFormProductCreate} from '@/utils/schemas'
import {selectUserStores} from '@/redux/user/userSlice'
import {TStore} from '@/libs/types'

interface IFormInput {
  name: string
  description: string
  category: string
  imageUrl?: string
  price: number
  quantity: number
  rating: number
  options?: string
  stores: TStore[]
  status: string
}
const defaultFormValues = {
  name: '',
  description: '',
  category: '',
  imageUrl: '',
  price: 0,
  quantity: 999,
  rating: 0,
  stores: [],
  options: '',
  status: 'draft',
}

const handleClick = (
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
) => {
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

export default function ProductCreate() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const existProductId = searchParams.get('id')
  const {isMobile} = useResponsive()
  const appState = useSelector((state: RootState) => state)
  const userStores = selectUserStores(appState)
  const userId = selectUserUid(appState)
  const [openLoading, setOpenLoading] = useState<boolean>(false)
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<IFile | null | undefined>(
    null,
  )
  const [storeNames, setStoreNames] = React.useState<string[]>([])
  const originalStoreNames = userStores?.map(obj => obj.name)
  const originalStatues = ['draft', 'published']
  const {data, isLoading, error} = useQuery({
    queryKey: [
      'getProductById',
      {
        id: existProductId,
      },
    ],
    queryFn: getProductById,
  })

  const {
    control,
    trigger,
    handleSubmit,
    setValue,
    clearErrors,
    getValues,
    reset,
    formState: {errors},
  } = useForm<IFormInput>({
    defaultValues: defaultFormValues,
    resolver: yupResolver(schemaFormProductCreate) as any,
  })

  useEffect(() => {
    if (data) {
      setValue('name', data.name ?? '')
      setValue('description', data.description ?? '')
      setValue('category', data.category ?? '')
      setValue('imageUrl', data.imageUrl ?? '')
      setValue('price', data.price ?? 0)
      setValue('quantity', data.quantity ?? 999)
      setValue('rating', data.rating ?? 0)
      setValue('stores', data.stores ?? [])
      setValue('options', data.options ?? '')
      setValue('status', data.status ?? 'draft')

      const names = data.stores?.map((obj: TStore) => obj.name) ?? []
      setStoreNames(names)
    }
  }, [data])

  const {name, price, quantity, stores} = getValues()
  const readyToCreate = name && price >= 0 && quantity && stores.length !== 0
  const handleOnReceivedFile = (file: any) => {
    if (!file) return
    setValue('imageUrl', '')
  }

  const resetAll = () => {
    setSelectedFile(null)
    setStoreNames([])
    reset()
  }
  const handleCreateOrUpdate: SubmitHandler<IFormInput> = async data => {
    setOpenLoading(true)
    let newProductId: any = ''
    const createdAt = new Date().getTime()
    if (existProductId) {
      let payload = {}
      if (selectedFile?.name) {
        const imageUrl = await uploadImage(selectedFile, selectedFile?.name)
        payload = {...data, imageUrl}
      }
      const {imageUrl, ...restData} = data
      payload = restData
      newProductId = await updateProduct(existProductId, payload)
    } else {
      if (selectedFile?.name) {
        const imageUrl = await uploadImage(selectedFile, selectedFile?.name)
        const payload = {...data, imageUrl, createdAt}
        newProductId = await createProduct(payload)
      } else {
        newProductId = await createProduct({...data, createdAt})
      }
    }

    setOpenLoading(false)

    if (newProductId) {
      setSuccess(true)
      resetAll()
    } else {
      setSuccess(false)
    }
    setOpenSnackbar(true)
  }
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenSnackbar(false)
  }
  const handleChange = (event: SelectChangeEvent<typeof storeNames>) => {
    const {
      target: {value},
    } = event
    const arrValues = typeof value === 'string' ? value.split(',') : value
    const selectedStores = userStores?.filter((el: any) =>
      arrValues.includes(el.name),
    )
    //const storeKeys = selectedStores?.map(obj => obj.id) ?? []

    setValue('stores', selectedStores ?? [])
    setStoreNames(arrValues)
    clearErrors('stores')
  }
  const onChangeStatus = (event: SelectChangeEvent) => {
    setValue('status', event.target.value as string)
  }
  const getSnackBarMessage = () => {
    if (success) {
      if (existProductId) return 'Successfully updated the product!'
      return 'Successfully created a new product!'
    } else {
      if (existProductId) return 'Failed to update the product!'
      return 'Failed to create a new product'
    }
  }
  return (
    <Container>
      <Title>Create a new product</Title>
      <Stack spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
      <Body elevation={1}>
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
                    label="Name*"
                    error={!!errors.name}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status*</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  defaultValue="draft"
                  render={({field}) => (
                    <Select
                      {...field}
                      label="Status*"
                      value={field.value}
                      onChange={onChangeStatus}>
                      {originalStatues?.map(name => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Price*</InputLabel>
                <Controller
                  name="price"
                  control={control}
                  render={({field}) => (
                    <CustomOutlinedInput
                      {...field}
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                      label="Price*"
                      error={!!errors.price}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="category"
                control={control}
                render={({field}) => (
                  <CustomTextField
                    {...field}
                    variant="outlined"
                    label="Category"
                    error={!!errors.category}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="quantity"
                control={control}
                render={({field}) => (
                  <CustomTextField
                    {...field}
                    variant="outlined"
                    label="Quantity*"
                    error={!!errors.quantity}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="options"
                control={control}
                render={({field}) => (
                  <CustomTextField
                    {...field}
                    variant="outlined"
                    label="Options"
                    error={!!errors.options}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.stores}>
                <InputLabel>Store*</InputLabel>
                <Controller
                  name="stores"
                  control={control}
                  defaultValue={[]}
                  render={({field}) => (
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Chip" />}
                      value={storeNames}
                      onChange={handleChange}
                      renderValue={selected => (
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                          {selected.map(value => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}>
                      {originalStoreNames?.map(name => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                name="description"
                control={control}
                render={({field}) => (
                  <MultilineTextField
                    {...field}
                    variant="outlined"
                    label="Description"
                    error={!!errors.description}
                    multiline
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <UploadFile
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                onReceived={handleOnReceivedFile}
              />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="center"
            flexDirection="row"
            marginTop={3}>
            <Button
              title={existProductId ? 'Update' : 'Create'}
              onClick={handleSubmit(handleCreateOrUpdate)}
              backgroundColor={undefined}
              width="200px"
              height="40px"
              disabled={!readyToCreate}
            />
          </Grid>
        </Box>
      </Body>
      <Backdrop
        sx={{color: '#fff', zIndex: theme => theme.zIndex.drawer + 1}}
        open={openLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={success ? 'success' : 'error'}
          sx={{width: '100%'}}>
          {getSnackBarMessage()}
        </Alert>
      </Snackbar>
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
const CustomTextField = styled(TextField)`
  display: flex;
  width: 100%;
  border-radius: 5px;
  & .MuiInputBase-root {
    height: 55px;
  }
`
const CustomOutlinedInput = styled(OutlinedInput)`
  display: flex;
  width: 100%;
  border-radius: 5px;
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

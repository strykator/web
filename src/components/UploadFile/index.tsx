import React, {useState} from 'react'
import styled from 'styled-components'
import {Typography, Input, IconButton} from '@mui/material'
import {CloudUploadOutlined} from '@mui/icons-material'
import Image from '@/components/Image'
import {theme} from '@/theme'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB in bytes
export interface IFile {
  name: string
}
interface IUploadFIle {
  imageUrl?: string
  setSelectedFile: any
  selectedFile: IFile | null | undefined
  onReceived: (file: any) => void
  maxSize?: number
  types?: string[] // image | application | pdf | video
}

export default function UploadFile({
  imageUrl,
  setSelectedFile,
  selectedFile,
  onReceived,
  maxSize = MAX_FILE_SIZE_BYTES,
  types = ['image'],
}: IUploadFIle) {
  const [dragging, setDragging] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [imageSrc, setImageSrc] = useState<any>(undefined)

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    const fileSize = file?.size ?? 0

    let correctFile = false
    types.forEach((type: string) => {
      if (file?.type.includes(type)) {
        correctFile = true
        return
      }
    })
    if (correctFile && fileSize <= maxSize) {
      setError('')
      const reader = new FileReader()

      reader.onloadend = () => {
        setImageSrc(reader.result)
      }
      reader.readAsDataURL(file)

      setSelectedFile(file)
      onReceived(file)
    } else {
      onReceived(null)
      setError('Incorrect file type or size')
    }
    setDragging(false)
  }
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!dragging) setDragging(true)
  }
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const fileSize = file?.size ?? 0

    let correctFile = false
    types.forEach((type: string) => {
      if (file?.type.includes(type)) {
        correctFile = true
        return
      }
    })
    if (correctFile && fileSize <= maxSize) {
      setError('')
      setSelectedFile(file)
      onReceived(file)
    } else {
      onReceived(null)
      setError('Incorrect file type or size')
    }
    setSelectedFile(event.target.files?.[0])
  }

  return (
    <DropArea
      dragging={dragging}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}>
      <UploadInput type="file" onChange={handleFileChange} id="inputFile" />
      <label htmlFor="inputFile">
        <IconButton component="span">
          <CloudUploadOutlined fontSize="large" />
        </IconButton>
      </label>

      {selectedFile || imageUrl ? (
        <>
          <DisplayImage
            src={imageSrc || (imageUrl as any)}
            alt="Selected Image"
            type="contain"
            width={60}
            height={60}
          />
          <FileName>{selectedFile?.name}</FileName>
        </>
      ) : (
        <>
          <Instruction hasFile={!!selectedFile}>
            Drag and Drop File Here
          </Instruction>
          <Instruction hasFile={!!selectedFile}>
            or Click Icon to Browse
          </Instruction>
          <Instruction hasFile={!!selectedFile}>Max 5 MB</Instruction>
        </>
      )}
      {error && <Error>{error}</Error>}
    </DropArea>
  )
}

const DropArea = styled('div')<{dragging: boolean}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-width: 200px;
  min-height: 200px;
  background-color: #f6f7f9;
  border: ${({dragging}) =>
    dragging ? '1.5px dashed #00A76F' : '0.7px dashed'};
  opacity: ${({dragging}) => (dragging ? '0.5' : '1')};
`
const Instruction = styled(Typography)<{hasFile?: boolean}>`
  color: ${({hasFile}) => (hasFile ? theme.color.textWeak : theme.color.text)};
  font-size: ${theme.font.size.s};
  font-weight: 500;
`
const FileName = styled(Instruction)`
  color: #00a76f;
`
const UploadInput = styled(Input)`
  display: none;
`
const Error = styled(Instruction)`
  color: ${theme.color.error};
`
const DisplayImage = styled(Image)`
  border-radius: 7px;
`

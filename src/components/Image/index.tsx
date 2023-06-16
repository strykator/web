'use client'

import React from 'react'
import styled from 'styled-components'
import MImage, {StaticImageData} from 'next/image'

interface IImage {
  src: string | StaticImageData
  width?: number
  height?: number
  type?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  alt?: string
}

export default function Image({width, height, src, type, alt = 'alt'}: IImage) {
  return (
    <Container width={width} height={height}>
      <MImage
        fill
        src={src}
        alt={alt}
        style={{objectFit: type ? type : 'cover'}}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </Container>
  )
}

const Container = styled('div')<{width?: number; height?: number}>`
  width: ${({width}) => (width ? `${width}px` : '100%')};
  height: ${({height}) => (height ? `${height}px` : '100%')};
  position: relative;
`

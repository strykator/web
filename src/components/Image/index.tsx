'use client'

import React from 'react'
import styled from 'styled-components'
import MImage, {StaticImageData} from 'next/image'

interface IImage {
  src: string | StaticImageData
  width?: number
  height?: number
  type?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  typePosition?: string
  alt?: string
}

export default function Image({
  width,
  height,
  src,
  type,
  alt = 'alt',
  typePosition,
  ...props
}: IImage) {
  return (
    <Container width={width} height={height}>
      <MImage
        fill
        src={src}
        alt={alt}
        style={{
          objectFit: type ? type : 'cover',
          objectPosition: typePosition ? typePosition : '',
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
    </Container>
  )
}

const Container = styled('div')<{width?: number; height?: number}>`
  width: ${({width}) => (width ? `${width}px` : '100%')};
  height: ${({height}) => (height ? `${height}px` : '100%')};
  position: relative;
`

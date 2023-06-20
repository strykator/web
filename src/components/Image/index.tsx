'use client'

import React from 'react'
import styled from 'styled-components'
import MImage, {StaticImageData} from 'next/image'

interface IImage {
  src: string | StaticImageData
  width?: number | string
  height?: number | string
  type?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  typePosition?: string
  alt?: string
  circle?: boolean
}

export default function Image({
  width,
  height,
  src,
  type,
  alt = 'alt',
  typePosition,
  circle,
  ...props
}: IImage) {
  return (
    <Container width={width} height={height}>
      <StyledImage
        fill
        src={src}
        alt={alt}
        style={{
          objectFit: type ? type : 'cover',
          objectPosition: typePosition ? typePosition : '',
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        circle={Boolean(circle)}
        {...props}
      />
    </Container>
  )
}

const Container = styled('div')<{
  width?: number | string
  height?: number | string
}>`
  width: ${({width}) => {
    if (width) return typeof width === 'string' ? width : `${width}px`
    return '100%'
  }};
  height: ${({height}) => {
    if (height) return typeof height === 'string' ? height : `${height}px`
    return '100%'
  }};
  position: relative;
`
const StyledImage = styled(MImage)<{circle?: boolean}>`
  border-radius: ${({circle}) => (circle ? '50%' : 'auto')};
`

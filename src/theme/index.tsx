import React from 'react'
import {ThemeProvider as StyledThemeProvider} from 'styled-components'
import {color} from './color'
import {font} from './font'

const theme = {
  color,
  font,
}

const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
}

export default ThemeProvider

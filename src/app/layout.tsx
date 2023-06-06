'use client'

import './globals.css'
import {Inter} from 'next/font/google'
import ThemeProvider from '@/theme'

const inter = Inter({subsets: ['latin']})

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <title>Feastta</title>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

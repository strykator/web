'use client'

import './globals.css'
import {Inter} from 'next/font/google'
import {Provider} from 'react-redux'
import {store} from '@/redux'
import {ApolloProvider} from '@apollo/client'
import ThemeProvider from '@/theme'
import Footer from '@/components/Footer'
import client from '@/libs/apollo'

const inter = Inter({subsets: ['latin']})

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <title>Feastta</title>
      <body className={inter.className}>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <ThemeProvider>
              {children}
              <Footer />
            </ThemeProvider>
          </ApolloProvider>
        </Provider>
      </body>
    </html>
  )
}

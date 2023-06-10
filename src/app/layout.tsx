'use client'

import './globals.css'
import {Inter} from 'next/font/google'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {ApolloProvider} from '@apollo/client'
import {store, persistor} from '@/redux'
import client from '@/libs/apollo'
import Footer from '@/components/Footer'
import ThemeProvider from '@/theme'

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
          <PersistGate loading={null} persistor={persistor}>
            <ApolloProvider client={client}>
              <ThemeProvider>
                {children}
                <Footer />
              </ThemeProvider>
            </ApolloProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  )
}

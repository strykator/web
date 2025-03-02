'use client'

import {Suspense} from 'react'
import './globals.css'
import {Inter, Poppins} from 'next/font/google'
import {Analytics as VercelAnalytics} from '@vercel/analytics/react'
import {Provider} from 'react-redux'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {PersistGate} from 'redux-persist/integration/react'
import {ApolloProvider} from '@apollo/client'
import {store, persistor} from '@/redux'
import client from '@/libs/apollo'
import ThemeProvider from '@/theme'
import {Typography} from '@mui/material'
import ShoppingCart from '@/components/ShoppingCart'
import Analytics from '@/components/Analyctics'
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles'

const inter = Inter({subsets: ['latin']})
const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
})
// React Query Client
const queryClient = new QueryClient()

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: "'Poppins', sans-serif",
    },
  },
})

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <title>Feastta</title>
      <body className={poppins.className}>
        <Suspense>
          <Analytics />
          <VercelAnalytics />
        </Suspense>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ApolloProvider client={client}>
              <MuiThemeProvider theme={theme}>
                <ThemeProvider>
                  <PersistGate loading={null} persistor={persistor}>
                    {children}
                    <ShoppingCart />
                  </PersistGate>
                  <Typography />
                </ThemeProvider>
              </MuiThemeProvider>
            </ApolloProvider>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  )
}

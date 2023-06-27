import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { SWRConfig } from 'swr'
import { CssBaseline, ThemeProvider } from '@mui/material'

import { CartProvider, UIProvider } from '../context'
import { lightTheme } from '../themes'
import { AuthProvider } from '@/context/auth'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <AuthProvider>
        <CartProvider>
          <UIProvider>
            <ThemeProvider theme={ lightTheme }>
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </UIProvider>
        </CartProvider>
      </AuthProvider>
    </SWRConfig>
  )
}

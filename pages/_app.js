import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { Inter } from '@next/font/google';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const inter = Inter({ subsets: ['latin']})

const whiteTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FFFFFF',
        },
    },
});

export default function App({ Component, pageProps: {
  session, ...pageProps
}, }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={whiteTheme}>
        <main className={inter.className}>
          <Component {...pageProps}/>
        </main>
      </ThemeProvider>
    </SessionProvider>
  )
}

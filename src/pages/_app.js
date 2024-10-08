import { useEffect } from 'react';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { registerChartJs } from '../utils/register-chart-js';
import useAuthStore from '../contexts/auth-context';
import { theme } from '../theme';

registerChartJs();

const clientSideEmotionCache = createEmotionCache();
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { isLoading, initialize } = useAuthStore();
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    initialize();
  }, [initialize]);


  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>
            FiveMUP
          </title>
          <meta
            name="viewport"
            content="initial-scale=1, width=device-width"
          />
        </Head>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {
              isLoading ? <></> : getLayout(<Component {...pageProps} />)
            }
          </ThemeProvider>
        </LocalizationProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
};

export default App;

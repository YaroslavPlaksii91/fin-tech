import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';

import useIsomorphicLayoutEffect from '@hooks/useIsomorphicEffect';
import { theme } from '@utils/theme';
import 'normalize.css/normalize.css';
import '@styles/main.scss';

/*
    Redefine useLayoutEffect with useIsomorphicLayoutEffect
    for prevent useLayoutEffect calls on the server.
*/
React.useLayoutEffect = useIsomorphicLayoutEffect;

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={theme}>
    <Component {...pageProps} />
  </ThemeProvider>
);

export default MyApp;

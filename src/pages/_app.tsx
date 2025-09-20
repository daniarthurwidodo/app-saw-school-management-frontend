import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import TanstackProvider from '../providers/TanstackProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TanstackProvider>
      <Component {...pageProps} />
    </TanstackProvider>
  );
}

export default MyApp;
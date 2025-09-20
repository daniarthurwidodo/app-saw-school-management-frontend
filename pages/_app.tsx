import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../components/auth';
import { DebugProvider, DebugToggle } from '../components/debug';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DebugProvider>
      <AuthProvider>
        <Component {...pageProps} />
        <DebugToggle />
      </AuthProvider>
    </DebugProvider>
  );
}

export default MyApp;
import type { AppProps } from 'next/app';

import { AppProvider } from '../app/providers';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
};

export default MyApp;

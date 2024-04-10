import { AppProvider } from "./contexts";
import type { AppProps } from 'next/app'; // Importa el tipo AppProps desde 'next/app'

function MyApp({ Component, pageProps }: AppProps) { // Asegúrate de importar AppProps desde 'next/app' y usarlo para tipar Component
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;

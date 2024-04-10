

import { AppProps } from 'next/app'; // Importa AppProps desde 'next/app'
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function App({ Component, pageProps }: AppProps) { // Usa AppProps para tipar Component
  return (
     <Component {...pageProps} />
  );
}

export default App;

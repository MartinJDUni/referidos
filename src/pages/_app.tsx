// pages/_app.tsx

import '../styles/globals.css';
import BootstrapWrapper from './components/BootstrapWrapper';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function App({ Component, pageProps }) {
  return (
    <BootstrapWrapper> <Component {...pageProps} /></BootstrapWrapper>
  );
}

export default App;

// components/BootstrapWrapper.tsx

import { useEffect } from 'react';

const BootstrapWrapper: React.FC = ({ children }) => {
  useEffect(() => {
    import('jquery');
    import('popper.js');
    import('bootstrap/dist/js/bootstrap.bundle.min');
  }, []);

  return <>{children}</>;
};

export default BootstrapWrapper;

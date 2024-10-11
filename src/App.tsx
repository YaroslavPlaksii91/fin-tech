import { RouterProvider } from 'react-router-dom';
import { LicenseInfo } from '@mui/x-license-pro';

import { router } from './routes';

import { MUI_LICENSE_KEY } from '@constants/common';

LicenseInfo.setLicenseKey(MUI_LICENSE_KEY);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

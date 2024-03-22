import { RouterProvider } from 'react-router-dom';
import { LicenseInfo } from '@mui/x-license-pro';

import { router } from './routes.tsx';

import { MUI_LICENSE_KEY } from '@constants/common.ts';
import api from '@utils/api.ts';
import { authService } from '@services/auth.ts';

LicenseInfo.setLicenseKey(MUI_LICENSE_KEY);

api.defaults.headers.Authorization = `Bearer ${authService.getToken()}`;

function App() {
  return <RouterProvider router={router} />;
}

export default App;

import { createBrowserRouter } from 'react-router-dom';

import PrivateRoute from '@components/Router/PrivateRoute';
import PrivateAuthRoute from '@components/Router/PrivateAuthRoute';
import Auth from '@pages/Auth';
import TestPage from '@pages/TestPage';

export const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    element: (
      <PrivateRoute>
        <TestPage />
      </PrivateRoute>
    )
  },
  {
    id: 'auth',
    path: '/auth',
    element: (
      <PrivateAuthRoute>
        <Auth />
      </PrivateAuthRoute>
    )
  }
]);

import { createBrowserRouter } from 'react-router-dom';

import PrivateRoutes from '@components/Router/PrivateRoutes';
import PrivateAuthRoute from '@components/Router/PrivateAuthRoute';
import Auth from '@pages/Login';
import Layout from '@components/Layout/Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <PrivateRoutes>
            <div>Home</div>
          </PrivateRoutes>
        )
      },
      {
        path: '/page1',
        element: (
          <PrivateRoutes>
            <div>page1</div>
          </PrivateRoutes>
        )
      },
      {
        path: '/page2',
        element: (
          <PrivateRoutes>
            <div>page2</div>
          </PrivateRoutes>
        )
      }
    ]
  },
  {
    path: '/login',
    element: (
      <PrivateAuthRoute>
        <Auth />
      </PrivateAuthRoute>
    )
  },
  { path: '*', element: <p>Not found</p> }
]);

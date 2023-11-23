import { createBrowserRouter } from 'react-router-dom';

import PrivateRoutes from '@components/Router/PrivateRoutes';
import PrivateAuthRoute from '@components/Router/PrivateAuthRoute';
import Login from '@pages/Login';
import Layout from '@components/Layout/Layout';
import routes from '@constants/routes';

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
        path: routes.underwriting.flowList,
        element: (
          <PrivateRoutes>
            <div>Flow list page</div>
          </PrivateRoutes>
        )
      },
      {
        path: routes.underwriting.dataDictionary,
        element: (
          <PrivateRoutes>
            <div>Data dictionary</div>
          </PrivateRoutes>
        )
      },
      {
        path: routes.underwriting.changeHistory,
        element: (
          <PrivateRoutes>
            <div>Change history</div>
          </PrivateRoutes>
        )
      }
    ]
  },
  {
    path: routes.auth.login,
    element: (
      <PrivateAuthRoute>
        <Login />
      </PrivateAuthRoute>
    )
  },
  { path: '*', element: <p>Not found</p> }
]);

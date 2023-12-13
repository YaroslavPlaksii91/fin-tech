import { createBrowserRouter } from 'react-router-dom';

import PrivateRoutes from '@components/Router/PrivateRoutes';
import PrivateAuthRoute from '@components/Router/PrivateAuthRoute';
import Login from '@pages/Login/Login';
import Layout from '@components/Layouts/Layout';
import routes from '@constants/routes';
import Flows from '@pages/Flows';
import FlowDetails from '@pages/FlowDetails';
import FlowEdit from '@pages/FlowEdit';

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
        path: `${routes.underwriting.flowList}/:id?`,
        element: (
          <PrivateRoutes>
            <Flows />
          </PrivateRoutes>
        )
      },
      {
        path: `${routes.underwriting.flowList}/details/:id`,
        element: (
          <PrivateRoutes>
            <FlowDetails />
          </PrivateRoutes>
        )
      },
      {
        path: `${routes.underwriting.flowList}/edit/:id`,
        element: (
          <PrivateRoutes>
            <FlowEdit />
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
    path: routes.login,
    element: (
      <PrivateAuthRoute>
        <Login />
      </PrivateAuthRoute>
    )
  },
  { path: '*', element: <p>Not found</p> }
]);

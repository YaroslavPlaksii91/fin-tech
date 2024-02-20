import { createBrowserRouter } from 'react-router-dom';

import PrivateRoutes from '@components/Router/PrivateRoutes';
import PrivateAuthRoute from '@components/Router/PrivateAuthRoute';
import Login from '@pages/Login/Login';
import Layout from '@components/Layouts/Layout';
import routes from '@constants/routes';
import Flows from '@pages/Flows';
import Home from '@pages/Home';
import FlowEdit from '@pages/FlowEdit';
import FlowDetails from '@pages/FlowDetails';
import ExpressionPage from '@pages/Expression.tsx';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <PrivateRoutes>
            <Home />
          </PrivateRoutes>
        )
      },
      {
        path: `${routes.underwriting.flow.list}/:id?`,
        element: (
          <PrivateRoutes>
            <Flows />
          </PrivateRoutes>
        )
      },
      {
        path: `${routes.underwriting.flow.details(':id')}`,
        element: (
          <PrivateRoutes>
            <FlowDetails />
          </PrivateRoutes>
        )
      },
      {
        path: `${routes.underwriting.flow.edit(':id')}`,
        element: (
          <PrivateRoutes>
            <FlowEdit />
          </PrivateRoutes>
        )
      },
      {
        path: routes.underwriting.leadRequest,
        element: (
          <PrivateRoutes>
            <div>Lead Request</div>
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
  {
    path: '/expression',
    element: <ExpressionPage />
  },
  { path: '*', element: <p>Not found</p> }
]);

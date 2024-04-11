import { createBrowserRouter } from 'react-router-dom';

import PrivateRoutes from '@components/Router/PrivateRoutes';
import PrivateAuthRoute from '@components/Router/PrivateAuthRoute';
import Login from '@pages/auth/Login.tsx';
import Layout from '@components/Layouts/Layout';
import routes from '@constants/routes';
import Flows from '@pages/Flows';
import Home from '@pages/Home';
import FlowEdit from '@pages/FlowEdit';
import FlowDetails from '@pages/FlowDetails';
import DataDictionary from '@pages/DataDictionary';
import ChangeHistoryPage from '@pages/ChangeHistory.tsx';
import AccessVerificationPage from '@pages/auth/AccessVerification.tsx';
// import LeadRequestsReportsPage from '@pages/LeadRequestsReports/LeadRequestsReports';
import Test from '@pages/LeadRequestsReports/LeadRequestReportsTest';

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
        path: `${routes.underwriting.flow.dataDictionary(':id')}`,
        element: (
          <PrivateRoutes>
            <DataDictionary />
          </PrivateRoutes>
        )
      },
      {
        path: routes.underwriting.leadRequest,
        element: (
          <PrivateRoutes>
            <Test />
            {/* <LeadRequestsReportsPage /> */}
          </PrivateRoutes>
        )
      },
      {
        path: routes.underwriting.changeHistory,
        element: (
          <PrivateRoutes>
            <ChangeHistoryPage />
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
  {
    path: routes.auth.accessVerification,
    element: (
      <PrivateAuthRoute>
        <AccessVerificationPage />
      </PrivateAuthRoute>
    )
  },
  { path: '*', element: <p>Not found</p> }
]);

import { createBrowserRouter } from 'react-router-dom';

import PrivateRoutes from '@components/Router/PrivateRoutes';
import PrivateAuthRoute from '@components/Router/PrivateAuthRoute';
import Login from '@pages/auth/Login.tsx';
import Layout from '@components/Layouts/Layout';
import routes from '@constants/routes';
import Home from '@pages/Home';
import FlowEdit from '@pages/FlowEdit';
import DataDictionary from '@pages/DataDictionary';
import ChangeHistoryPage from '@pages/ChangeHistory';
import AccessVerificationPage from '@pages/auth/AccessVerification';
import LeadRequestsReportsPage from '@pages/LeadRequestsReports';
import DenielReasonsPage from '@pages/DenielReasons';
import WaterfallPage from '@pages/Waterfall';
import FlowList from '@pages/FlowList';
import { permissionsMap } from '@constants/permissions';
import PermissionDeniedPage from '@pages/PermissionDenied';

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
            <FlowList />
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
        path: `${routes.underwriting.flow.view(':id')}`,
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
          <PrivateRoutes permission={permissionsMap.canViewLeadRequestReport}>
            <LeadRequestsReportsPage />
          </PrivateRoutes>
        )
      },
      {
        path: routes.underwriting.denialReasons,
        element: (
          <PrivateRoutes>
            <DenielReasonsPage />
          </PrivateRoutes>
        )
      },
      {
        path: routes.underwriting.waterfall,
        element: (
          <PrivateRoutes>
            <WaterfallPage />
          </PrivateRoutes>
        )
      },
      {
        path: routes.underwriting.changeHistory,
        element: (
          <PrivateRoutes permission={permissionsMap.canViewChangeHistory}>
            <ChangeHistoryPage />
          </PrivateRoutes>
        )
      },
      {
        path: routes.permissionDenied,
        element: (
          <PrivateRoutes>
            <PermissionDeniedPage />
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

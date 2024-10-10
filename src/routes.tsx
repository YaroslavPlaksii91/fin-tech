import { createBrowserRouter } from 'react-router-dom';

import Login from '@pages/auth/Login';
import Home from '@pages/Home';
import FlowEdit from '@pages/FlowEdit';
import DataDictionary from '@pages/DataDictionary';
import ChangeHistoryPage from '@pages/ChangeHistory';
import AccessVerificationPage from '@pages/auth/AccessVerification';
import LeadRequestsReports from '@pages/LeadRequestsReports';
import DenialReasons from '@pages/DenialReasons';
import Waterfall from '@pages/Waterfall';
import BillingReport from '@pages/BillingReport';
import FlowList from '@pages/FlowList';
import PermissionDenied from '@pages/PermissionDenied';
import Layout from '@components/Layouts/Layout';
import PrivateRoutes from '@components/Router/PrivateRoutes';
import PrivateAuthRoute from '@components/Router/PrivateAuthRoute';
import routes from '@constants/routes';
import { permissionsMap } from '@constants/permissions';

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
        path: `${routes.underwriting.flow.list(':id?')}`,
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
            <LeadRequestsReports />
          </PrivateRoutes>
        )
      },
      {
        path: routes.underwriting.denialReasons,
        element: (
          <PrivateRoutes>
            <DenialReasons />
          </PrivateRoutes>
        )
      },
      {
        path: routes.underwriting.waterfall,
        element: (
          <PrivateRoutes>
            <Waterfall />
          </PrivateRoutes>
        )
      },
      {
        path: routes.underwriting.billingReport,
        element: (
          <PrivateRoutes>
            <BillingReport />
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
            <PermissionDenied />
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
    element: <AccessVerificationPage />
  },
  { path: '*', element: <p>Not found</p> }
]);

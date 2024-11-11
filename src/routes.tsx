import { createBrowserRouter } from 'react-router-dom';

import withLazyLoading from '@hocs/withLazyLoading';
const Home = withLazyLoading(() => import('@pages/Home'));
const FlowEdit = withLazyLoading(() => import('@pages/FlowEdit'));
const DataDictionary = withLazyLoading(() => import('@pages/DataDictionary'));
const ChangeHistory = withLazyLoading(() => import('@pages/ChangeHistory'));
const AccessVerification = withLazyLoading(
  () => import('@pages/AccessVerification')
);
const LeadRequestsReports = withLazyLoading(
  () => import('@pages/LeadRequestsReports')
);
const DenialReasons = withLazyLoading(() => import('@pages/DenialReasons'));
const Waterfall = withLazyLoading(() => import('@pages/Waterfall'));
const BillingReport = withLazyLoading(() => import('@pages/BillingReport'));
const FlowList = withLazyLoading(() => import('@pages/FlowList'));
const PermissionDenied = withLazyLoading(
  () => import('@pages/PermissionDenied')
);
import Login from '@pages/Login';
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
        path: routes.index,
        element: (
          <PrivateRoutes permission={permissionsMap.canViewLeadRequestReport}>
            <LeadRequestsReports />
          </PrivateRoutes>
        )
      },
      {
        path: routes.home,
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
            <ChangeHistory />
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
    element: <AccessVerification />
  },
  { path: '*', element: <p>Not found</p> }
]);

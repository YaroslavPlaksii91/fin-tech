import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import routes from '@constants/routes';
import { authService } from '@services/auth.ts';
import { useHasUserPermission } from '@hooks/useHasUserPermission';

const PrivateRoutes = (props: {
  children: React.ReactNode;
  permission?: string;
}) => {
  const location = useLocation();
  const hasUserPermission = useHasUserPermission(props.permission);

  if (!authService.isTokenSet()) {
    return <Navigate to={routes.auth.login} state={{ from: location }} />;
  }

  if (!hasUserPermission) {
    return <Navigate to={routes.permissionDenied} />;
  }

  return props.children;
};

export default PrivateRoutes;

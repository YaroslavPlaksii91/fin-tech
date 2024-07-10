import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import routes from '@constants/routes';
import { authService } from '@services/auth.ts';
import { fetchUserInfo, selectUserInfo } from '@store/auth/auth.ts';
import { useAppDispatch, useAppSelector } from '@store/hooks.ts';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import LoadingFullscreen from '@components/shared/LoadingFullscreen';

const PrivateRoutes = (props: {
  children: React.ReactNode;
  permission?: string;
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUserInfo);
  const hasUserPermission = useHasUserPermission(props.permission);

  useEffect(() => {
    void dispatch(fetchUserInfo());
  }, [dispatch]);

  useEffect(() => {
    void authService.fetchAllowedApplications();
  }, []);

  if (!authService.isTokenSet()) {
    return <Navigate to={routes.auth.login} state={{ from: location }} />;
  }

  if (!hasUserPermission) {
    return <Navigate to={routes.permissionDenied} />;
  }
  if (!user) {
    return <LoadingFullscreen />;
  }

  return props.children;
};

export default PrivateRoutes;

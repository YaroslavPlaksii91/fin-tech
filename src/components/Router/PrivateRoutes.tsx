import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookie from 'js-cookie';

import routes from '@constants/routes';
import { cookiesKeys } from '@constants/constants';

const PrivateRoutes = (props: { children: React.ReactNode }) => {
  const location = useLocation();
  const user = Cookie.get(cookiesKeys.credentials);

  if (!user) {
    return <Navigate to={routes.login} state={{ from: location }} />;
  }

  return props.children;
};

export default PrivateRoutes;

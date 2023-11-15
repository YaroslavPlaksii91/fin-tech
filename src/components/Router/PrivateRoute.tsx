import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { isAuthorized } from '@store/user/selectors';

const PrivateRoute = (props: { children: React.ReactNode }) =>
  useSelector(isAuthorized) ? props.children : <Navigate to="/auth" />;

export default PrivateRoute;

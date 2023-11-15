import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { isAuthorized } from '@store/user/selectors';

const PrivateAuthRoute = (props: { children: React.ReactNode }) =>
  useSelector(isAuthorized) ? <Navigate to="/" /> : props.children;

export default PrivateAuthRoute;

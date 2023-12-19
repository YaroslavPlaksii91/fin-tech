import Cookie from 'js-cookie';
import { Navigate } from 'react-router-dom';

import { cookiesKeys } from '@constants/common';

const PrivateAuthRoute = (props: { children: React.ReactNode }) => {
  const user = Cookie.get(cookiesKeys.credentials);
  return user ? <Navigate to="/" /> : props.children;
};

export default PrivateAuthRoute;

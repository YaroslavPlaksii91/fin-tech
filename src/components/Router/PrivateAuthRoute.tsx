import { Navigate } from 'react-router-dom';

import { authService } from '@services/auth';

const PrivateAuthRoute = (props: { children: React.ReactNode }) =>
  authService.isTokenSet() ? <Navigate to="/" /> : props.children;

export default PrivateAuthRoute;

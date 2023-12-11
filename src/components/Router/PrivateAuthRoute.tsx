import Cookie from 'js-cookie';
import { Navigate } from 'react-router-dom';

const PrivateAuthRoute = (props: { children: React.ReactNode }) => {
  const user = Cookie.get('authToken');
  return user ? <Navigate to="/" /> : props.children;
};

export default PrivateAuthRoute;

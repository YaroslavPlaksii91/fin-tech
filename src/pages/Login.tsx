import Typography from '@mui/material/Typography';
import { Button, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

import { mockUser } from '../mockUser';

import { setUser } from '@store/user/user';
import Auth from '@utils/auth';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const fromPage: string =
    (location.state as { from: { pathname: string } } | undefined)?.from
      ?.pathname || '/';

  const login = useCallback(() => {
    Auth.login(mockUser.key);

    dispatch(setUser(mockUser.user));
    navigate(fromPage, { replace: true });
  }, []);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh' }}
    >
      <Grid container direction="column" alignItems="center">
        <Typography align="center" variant="h5">
          Welcome to the Underwriting plantform
        </Typography>
        <Button onClick={() => login()} variant="contained">
          Log in
        </Button>
      </Grid>
    </Grid>
  );
}

export default Login;

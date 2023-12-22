import Typography from '@mui/material/Typography';
import { Grid, Stack } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';

import validationSchema from './validationSchema';

import { InputText } from '@components/shared/Forms/InputText';
import api from '@utils/api';
import { ChartIcon } from '@components/shared/Icons';
import Auth from '@utils/auth';
import LoadingButton from '@components/shared/LoadingButton';

type FormData = {
  username: string;
  password: string;
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    handleSubmit,
    control,
    setError,
    formState: { isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const fromPage: string =
    (location.state as { from: { pathname: string } } | undefined)?.from
      ?.pathname || '/';

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const res = await api.get('/flows', {
        auth: { username: data.username, password: data.password }
      });
      if (res.status === 200) {
        Auth.login(data.username, data.password);
        navigate(fromPage, { replace: true });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error?.response?.status === 401) {
          setError('username', {
            type: 'server',
            message: 'Incorrect username or password.'
          });
        }
      }
    }
  };

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
        <ChartIcon />
        <Typography pb={3} align="center" variant="h3">
          Welcome to Underwriting platform
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <InputText
              fullWidth
              name="username"
              control={control}
              label="Username"
              placeholder="Enter username"
            />
            <InputText
              fullWidth
              name="password"
              type="password"
              control={control}
              label="Password"
              placeholder="Enter password"
            />
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              Log in
            </LoadingButton>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
}

export default Login;

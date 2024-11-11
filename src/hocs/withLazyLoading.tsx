import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Button, Typography } from '@mui/material';

import Loader from '@components/shared/Loader';
import Logger from '@utils/logger';

const handleWindowReload = () => window.location.reload();

const ErrorFallback = ({
  error
}: {
  error: { message: string };
  resetErrorBoundary: () => void;
}) => {
  Logger.info(error.message);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography variant="body1">Something went wrong!</Typography>
      <Button size="small" variant="contained" onClick={handleWindowReload}>
        Try again
      </Button>
    </Box>
  );
};

// To handle failed dynamic import due to loss network connection
const lazyWithReload = (
  load: () => Promise<{
    default: () => JSX.Element;
  }>
) =>
  lazy(
    async () =>
      await load()
        .then((value) => {
          window.removeEventListener('online', handleWindowReload);

          return value;
        })
        .catch((error: string) => {
          window.addEventListener('online', handleWindowReload);

          throw Error(error);
        })
  );

const withLazyLoading = (
  load: () => Promise<{
    default: () => JSX.Element;
  }>
) => {
  const LazyComponent = lazyWithReload(load);

  const Wrapper = () => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loader elSize="medium" />}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );

  return Wrapper;
};

export default withLazyLoading;

import Box from '@mui/material/Box';

import { CircularProgress } from './Icons';

const LoadingFullscreen = () => (
  <Box
    height="100%"
    width="100%"
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <CircularProgress />
  </Box>
);

export default LoadingFullscreen;

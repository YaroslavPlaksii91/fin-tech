import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

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

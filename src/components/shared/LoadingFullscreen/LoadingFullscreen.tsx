import Box from '@mui/material/Box';

import { CircularProgress } from '../Icons';

const LoadingFullscreen = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(256, 256, 256, 0.6)',
      zIndex: 4
    }}
  >
    <CircularProgress />
  </Box>
);

export default LoadingFullscreen;

import Box from '@mui/material/Box';

import { CircularProgress } from './Icons';

const LoadingFullscreen = () => (
  <Box
    height="100%"
    width="100%"
    display="flex"
    justifyContent="center"
    alignItems="center"
    position="absolute"
    top="0"
    left="0"
    sx={{ background: 'white', zIndex: '1', opacity: '0.8' }}
  >
    <CircularProgress />
  </Box>
);

export default LoadingFullscreen;

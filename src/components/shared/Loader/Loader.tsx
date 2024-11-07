import { CSSProperties } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const sizes = {
  small: 20,
  medium: 40,
  large: 60
};

const Loader = ({ elSize = 'large', sx }: LoaderProps) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: '20px', ...sx }}>
    <CircularProgress size={sizes[elSize]} />
  </Box>
);

interface LoaderProps {
  elSize?: 'small' | 'medium' | 'large';
  sx?: CSSProperties;
}

export default Loader;

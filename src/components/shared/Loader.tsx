import React, { CSSProperties } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const sizes = {
  small: 20,
  large: 60
};

const Loader: React.FC<LoaderProps> = ({ elSize = 'large', sx = {} }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: '20px', ...sx }}>
    <CircularProgress size={sizes[elSize]} />
  </Box>
);

interface LoaderProps {
  elSize?: 'small' | 'large';
  sx?: CSSProperties;
}

export default Loader;
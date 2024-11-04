import React from 'react';
import { Typography, Box, Divider } from '@mui/material';

import { theme } from '@theme';

interface DiffCardProps {
  label: string;
  children: React.ReactNode;
}

const DiffCard = ({ label, children }: DiffCardProps) => (
  <Box
    sx={{
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '8px',
      '&:not(:last-child)': {
        mb: 1
      }
    }}
  >
    <Typography
      sx={{
        background: theme.palette.background.default,
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        padding: '4px 8px'
      }}
      variant="body1"
    >
      {label}
    </Typography>
    <Divider />
    <Box
      overflow="auto"
      sx={{
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
        padding: '8px'
      }}
    >
      {children}
    </Box>
  </Box>
);

export default DiffCard;

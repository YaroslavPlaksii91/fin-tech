import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
// import ReactDiffViewer from 'react-diff-viewer';

// import { ChangeHistoryDifference } from '@domain/changeHistory.ts';
import { theme } from '@theme';

interface ChangeHistoryDiffCardProps {
  label: string;
  children: React.ReactNode;
}

const ChangeHistoryDiffCard: React.FC<ChangeHistoryDiffCardProps> = ({
  label,
  children
}) => (
  <Box
    sx={{
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '8px',
      margin: '4px 0'
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

export default ChangeHistoryDiffCard;

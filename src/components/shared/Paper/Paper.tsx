import { Paper as MuiPaper, PaperProps } from '@mui/material';

import { customBoxShadows, theme } from '@theme';

const Paper = ({ children, sx, ...props }: PaperProps) => (
  <MuiPaper
    elevation={1}
    sx={{
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '16px',
      overflow: 'auto',
      boxShadow: customBoxShadows.elevation1,
      ...sx
    }}
    {...props}
  >
    {children}
  </MuiPaper>
);

export default Paper;

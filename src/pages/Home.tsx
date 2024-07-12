import { Box, Typography } from '@mui/material';

import ChartIcon from '@icons/chart.svg';

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        margin: 'auto',
        height: '100%',
        justifyContent: 'center'
      }}
    >
      <Typography variant="h5">Underwriting platform</Typography>
      <ChartIcon />
    </Box>
  );
}

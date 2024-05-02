import { Box, Typography } from '@mui/material';

import ChartIcon from '@icons/chart.svg';
import { LayoutContainer } from '@components/Layouts/MainLayout';

export default function Home() {
  return (
    <LayoutContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', margin: 'auto' }}>
        <Typography variant="h5">Underwriting platform</Typography>
        <ChartIcon />
      </Box>
    </LayoutContainer>
  );
}

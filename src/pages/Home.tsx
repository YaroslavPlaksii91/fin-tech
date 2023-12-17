import { Box, Typography } from '@mui/material';

import { LayoutContainer } from '@components/Layouts/MainLayout';
import { ChartIcon } from '@components/shared/Icons';

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

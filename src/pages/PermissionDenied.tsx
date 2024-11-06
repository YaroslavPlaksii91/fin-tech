import { Box, Button, Typography } from '@mui/material';

import { LayoutContainer } from '@components/Layouts/MainLayout';
import routes from '@constants/routes';

const PermissionDenied = () => (
  <LayoutContainer>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        margin: 'auto',
        gap: 1
      }}
    >
      <Typography variant="h5">
        You do not have permission to view this page
      </Typography>
      <Button type="button" variant="contained" href={routes.home}>
        Go to homepage
      </Button>
    </Box>
  </LayoutContainer>
);

export default PermissionDenied;

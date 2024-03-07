import { useParams } from 'react-router-dom';
import { Box, Typography, Breadcrumbs, Stack, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { LayoutContainer } from '@components/Layouts/MainLayout';
import { ChartIcon } from '@components/shared/Icons';
import routes from '@constants/routes';

export default function DataDictionary() {
  const { id } = useParams();

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href={routes.underwriting.flow.list}
    >
      Flow list
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href={routes.underwriting.flow.details(id as string)}
    >
      Main flow
    </Link>,
    <Typography key="3" color="text.primary">
      Data dictionary
    </Typography>
  ];
  return (
    <LayoutContainer>
      <Stack spacing={2} pl={12} pt={2}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="medium" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
      <Box sx={{ display: 'flex', alignItems: 'center', margin: 'auto' }}>
        <Typography variant="h5">Data dictionary</Typography>
        <ChartIcon />
      </Box>
    </LayoutContainer>
  );
}

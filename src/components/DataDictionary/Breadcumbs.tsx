import {
  Typography,
  Breadcrumbs as MuiBreadcrumbs,
  Stack,
  Link
} from '@mui/material';
import { useParams } from 'react-router-dom';

import { theme } from '@theme';
import routes from '@constants/routes';

interface BreadcrumbsProps {
  name: string;
}

const Breadcrumbs = ({ name }: BreadcrumbsProps) => {
  const { id } = useParams();

  const breadcrumbs = [
    <Link
      underline="hover"
      key="main-flow"
      variant="body1"
      color={theme.palette.text.secondary}
      href={`${routes.underwriting.flow.list(id)}`}
    >
      {name}
    </Link>,
    <Typography
      key="data-dictionary"
      variant="body1"
      color={theme.palette.text.primary}
    >
      Data Dictionary
    </Typography>
  ];
  return (
    <Stack spacing={2}>
      <MuiBreadcrumbs separator="/" aria-label="breadcrumb">
        {breadcrumbs}
      </MuiBreadcrumbs>
    </Stack>
  );
};

export default Breadcrumbs;

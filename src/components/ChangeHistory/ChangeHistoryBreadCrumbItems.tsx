import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import { theme } from '@theme';

type BreadcrumbItemProps = {
  part: { id: string; name: string };
  index: number;
};

export const FirstBreadcrumbItem = ({
  part,
  index,
  handleClick
}: BreadcrumbItemProps & {
  handleClick: (id: string, index: number) => void;
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography
      sx={{
        textDecoration: 'underline',
        cursor: 'pointer'
      }}
      color={theme.palette.info.main}
      variant="body2"
      onClick={() => handleClick(part.id, index)}
    >
      {part.name}
    </Typography>
  </Box>
);

export const BreadcrumbItem = ({ part }: BreadcrumbItemProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography variant="body2">{part.name}</Typography>
  </Box>
);

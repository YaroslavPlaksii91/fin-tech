import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import { theme } from '@theme';
import SubflowIcon from '@icons/subflow.svg';
import FlowIcon from '@icons/flow.svg';

const getPathIcon = (index: number) =>
  index === 0 ? (
    <FlowIcon width={18} height={18} />
  ) : (
    <SubflowIcon width={18} height={18} />
  );

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
    {getPathIcon(index)}
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

export const BreadcrumbItem = ({ part, index }: BreadcrumbItemProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {getPathIcon(index)}
    <Typography
      sx={{
        textDecoration: 'underline'
      }}
      variant="body2"
    >
      {part.name}
    </Typography>
  </Box>
);

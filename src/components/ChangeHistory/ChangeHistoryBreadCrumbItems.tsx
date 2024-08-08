import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import { theme } from '@theme';
import BezierIcon from '@icons/bezier.svg';
import LineChartDotsSquareIcon from '@icons/lineChartDotsSquare.svg';

const getPathIcon = (index: number, color: string) =>
  index === 0 ? (
    <BezierIcon width="18px" height="18px" color={color} />
  ) : (
    <LineChartDotsSquareIcon width="18px" height="18px" color={color} />
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
    {getPathIcon(index, theme.palette.primary.main)}
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
    {getPathIcon(index, '')}
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

import { Stack, Typography, TypographyProps } from '@mui/material';

import { palette } from '../../themeConfig';

import { HexagonOutlinedIcon } from './Icons';

interface SubHeaderProps {
  text: string;
  variant?: TypographyProps['variant'];
  icon?: React.ReactNode;
}

const SubHeader: React.FC<SubHeaderProps> = ({
  variant = 'h5',
  icon = <HexagonOutlinedIcon />,
  text
}) => (
  <Stack
    color={palette.gray}
    pl={2}
    pr={2}
    direction="row"
    spacing={1}
    alignItems="center"
  >
    {icon}
    <Typography variant={variant}>{text}</Typography>
  </Stack>
);

export default SubHeader;

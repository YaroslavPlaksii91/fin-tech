import { Stack, StackProps, Typography, TypographyProps } from '@mui/material';

import { palette } from '../../themeConfig';

import { HexagonOutlinedIcon } from './Icons';

interface HeaderProps extends StackProps {
  text: string;
  variant?: TypographyProps['variant'];
  icon?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  variant = 'h5',
  icon = <HexagonOutlinedIcon />,
  text,
  ...props
}) => (
  <Stack
    color={palette.gray}
    pl={2}
    pr={2}
    direction="row"
    spacing={1}
    alignItems="center"
    {...props}
  >
    {icon}
    <Typography variant={variant}>{text}</Typography>
  </Stack>
);

export default Header;

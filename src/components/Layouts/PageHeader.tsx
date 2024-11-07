import { Stack, StackProps, Typography } from '@mui/material';
import { ReactElement } from 'react';

import { theme } from '@theme';

interface PageHeaderProps {
  title: string;
  children?: ReactElement | ReactElement[];
  wrapperProps?: StackProps;
}

const PageHeader = ({ title, children, wrapperProps }: PageHeaderProps) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    spacing={2}
    pb={2}
    {...wrapperProps}
  >
    <Typography variant="h4" color={theme.palette.text.primary}>
      {title}
    </Typography>
    {children ? (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        {children}
      </Stack>
    ) : null}
  </Stack>
);

export default PageHeader;

import { Divider, Stack, Typography } from '@mui/material';

import { palette } from '../../themeConfig';

import CroppedText from '@components/shared/CroppedText';
import { DatabaseIcon } from '@components/shared/Icons';

const FlowHeader: React.FC<{ name: string }> = ({ name }) => (
  <Stack pl={2} pr={2} spacing={1}>
    <Typography variant="h5">
      <CroppedText>{name}</CroppedText>
    </Typography>
    <Stack
      display="flex"
      direction="row"
      alignItems="center"
      spacing={1}
      pb={0.5}
    >
      <Typography color={palette.gray} variant="body2">
        Data dictionary
      </Typography>
      <DatabaseIcon />
    </Stack>
    <Divider />
  </Stack>
);

export default FlowHeader;

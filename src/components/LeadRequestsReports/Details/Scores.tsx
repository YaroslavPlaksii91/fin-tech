import { Box, Stack, Typography } from '@mui/material';

import { RowData } from './types';

import { theme } from '@theme';

interface ScoresProps {
  data?: RowData['scores'];
}

const Scores = ({ data }: ScoresProps) => (
  <Stack flexDirection="column" spacing={1} maxHeight={790}>
    {Object.entries(data || {}).map(([key, value]) => (
      <Typography
        key={key}
        variant="body1"
        color={theme.palette.text.secondary}
      >
        {key}:{' '}
        <Box component="span" color={theme.palette.common.black}>
          {value}
        </Box>
      </Typography>
    ))}
  </Stack>
);

export default Scores;

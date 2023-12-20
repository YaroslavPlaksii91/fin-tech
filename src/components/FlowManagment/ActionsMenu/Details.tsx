import React from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { FULL_DATE_TIME_FORMAT } from '@constants/common';

const Details: React.FC<{ editedBy: string; editedOn: string }> = ({
  editedBy,
  editedOn
}) => (
  <Stack pl={2} pr={2} pt={1}>
    <Divider />
    <Typography pt={1} variant="caption">
      Last edited by {editedBy}
    </Typography>
    <Typography sx={{ fontWeight: 500 }} variant="caption">
      {dayjs(editedOn).format(FULL_DATE_TIME_FORMAT)}
    </Typography>
  </Stack>
);

export default Details;

import React from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { FULL_DATE_TIME_FORMAT } from '@constants/common';
import { NodeData } from '@domain/flow';

const Details: React.FC<{ data: NodeData }> = ({
  data: { note, editedBy, editedOn }
}) => (
  <Stack pl={2} pr={2} pt={1}>
    <Divider />
    <Typography pt={1} variant="caption">
      Last edited by {editedBy}
    </Typography>
    <Typography pb={1} variant="body2">
      {dayjs(editedOn).format(FULL_DATE_TIME_FORMAT)}
    </Typography>
    <Divider />
    <Typography pt={1} variant="caption">
      Note
    </Typography>
    <Typography sx={{ width: '156px' }} variant="body2">
      {note}
    </Typography>
  </Stack>
);

export default Details;

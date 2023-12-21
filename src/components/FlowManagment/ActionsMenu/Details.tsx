import React from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { FULL_DATE_TIME_FORMAT } from '@constants/common';
import { IFlowListItem } from '@domain/flow';

const Details: React.FC<{ flow: IFlowListItem }> = ({
  flow: { editedBy, editedOn, createdBy, createdOn }
}) => (
  <Stack pl={2} pr={2} pt={1}>
    <Divider />
    <Typography pt={1} variant="caption">
      Created by {createdBy}
    </Typography>
    <Typography pb={1} sx={{ fontWeight: 500 }} variant="caption">
      {dayjs(createdOn).format(FULL_DATE_TIME_FORMAT)}
    </Typography>
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

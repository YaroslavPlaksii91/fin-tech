import React from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { FULL_DATE_TIME_FORMAT } from '@constants/common';
import { IFlowListItem } from '@domain/flow';

const Details: React.FC<{ flow: IFlowListItem }> = ({
  flow: { editedBy, editedOn, createdBy, createdOn }
}) => (
  <Stack pt={1}>
    <Divider />
    <Box px={2} py={1}>
      <Typography variant="caption" color="text.secondary">
        Created by {createdBy}
      </Typography>
      <Typography variant="body2">
        {dayjs(createdOn).format(FULL_DATE_TIME_FORMAT)}
      </Typography>
    </Box>
    <Divider />
    <Box px={2} pt={1}>
      <Typography variant="caption" color="text.secondary">
        Last edited by {editedBy}
      </Typography>
      <Typography variant="body2">
        {dayjs(editedOn).format(FULL_DATE_TIME_FORMAT)}
      </Typography>
    </Box>
  </Stack>
);

export default Details;

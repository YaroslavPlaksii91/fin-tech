import { IconButton, ListItem, ListItemText } from '@mui/material';
import React from 'react';

import { StyledList } from './styled';

import { AddCircleOutlineIcon } from '@components/shared/Icons';

function generate(element: React.ReactElement) {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) =>
    React.cloneElement(element, {
      key: value
    })
  );
}

export default function List() {
  return (
    <StyledList>
      {generate(
        <ListItem
          secondaryAction={
            <IconButton onClick={() => 'click'} edge="end" aria-label="add">
              <AddCircleOutlineIcon fontSize="large" />
            </IconButton>
          }
        >
          <ListItemText primary="Single-line item" />
        </ListItem>
      )}
    </StyledList>
  );
}

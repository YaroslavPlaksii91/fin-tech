import { ReactNode } from 'react';
import { Box, List as MuiList, Stack, Typography } from '@mui/material';

import { StyledListSubheader } from './styled';

interface ListProps {
  isEmpty: boolean;
  emptyStateText: string;
  title: string;
  children: ReactNode[];
}

const List = ({ isEmpty, emptyStateText, title, children }: ListProps) => (
  <MuiList
    sx={{ padding: 0 }}
    subheader={
      <StyledListSubheader>
        <Typography variant="body1">{title}</Typography>
      </StyledListSubheader>
    }
  >
    <Box
      component="li"
      sx={{
        overflow: 'auto',
        height: 300,
        maxHeight: '70vh',
        display: isEmpty ? 'flex' : 'block'
      }}
    >
      {isEmpty ? (
        <Stack flexGrow={1} alignItems="center" justifyContent="center">
          <Typography
            sx={{ transform: 'translateY(-40px)' }}
            textAlign="center"
            variant="body2"
            color="gray"
          >
            {emptyStateText}
          </Typography>
        </Stack>
      ) : (
        children
      )}
    </Box>
  </MuiList>
);

export default List;

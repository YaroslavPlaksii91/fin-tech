import { ReactNode } from 'react';
import {
  Box,
  List as MuiList,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import { StyledListSubheader } from './styled';

import { theme } from '@theme';

interface ListProps {
  isEmpty: boolean;
  emptyStateText: string;
  title: string;
  subtitle?: string;
  children: ReactNode[];
  searchQuery: string;
  onSearch: (query: string) => void;
}

const List = ({
  isEmpty,
  emptyStateText,
  title,
  subtitle,
  children,
  searchQuery,
  onSearch
}: ListProps) => (
  <MuiList
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: 0
    }}
    subheader={
      <StyledListSubheader
        sx={{
          flexGrow: 1
        }}
      >
        <Typography variant="body1">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </StyledListSubheader>
    }
  >
    <Box
      component="li"
      sx={{
        overflow: 'auto',
        height: 300,
        maxHeight: '70vh',
        display: isEmpty ? 'flex' : 'block',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: theme.palette.background.paper,
          px: 3,
          mb: 1
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by Keyword"
          size="small"
          value={searchQuery}
          onChange={(e) => {
            onSearch(e.target.value);
          }}
        />
      </Box>
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

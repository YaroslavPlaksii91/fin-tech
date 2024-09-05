import { ReactNode } from 'react';
import {
  Box,
  Stack,
  Typography,
  Drawer,
  Button,
  IconButton
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export interface TemplateProps {
  isOpen: boolean;
  children: ReactNode;
  onReset: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

const Template = ({
  isOpen,
  children,
  onReset,
  onSubmit,
  onClose
}: TemplateProps) => (
  <Drawer anchor="right" open={isOpen} onClose={onClose}>
    <form onSubmit={onSubmit} onReset={onReset}>
      <Box sx={{ width: '384px', padding: '8px' }}>
        <Stack spacing={1} alignItems="center" sx={{ padding: '8px 16px' }}>
          <Stack spacing={1} direction="row" alignItems="center" width="100%">
            <IconButton sx={{ padding: '2px' }} onClick={onClose}>
              <ChevronRightIcon sx={{ fontSize: '28px' }} />
            </IconButton>
            <Typography variant="h6">Filters</Typography>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'flex-end',
                gap: '8px'
              }}
            >
              <Button size="small" variant="contained" type="submit">
                Apply
              </Button>
              <Button
                size="small"
                color="inherit"
                variant="outlined"
                type="reset"
              >
                Reset
              </Button>
            </Box>
          </Stack>
          <Stack sx={{ width: '100%' }} direction="column" spacing={1}>
            {children}
          </Stack>
        </Stack>
      </Box>
    </form>
  </Drawer>
);

export default Template;

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
    <Box sx={{ padding: '16px 24px', width: '384px', boxSizing: 'border-box' }}>
      <form onSubmit={onSubmit} onReset={onReset}>
        <Stack spacing={1}>
          <Stack spacing={1} direction="row">
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
              <Button
                size="small"
                variant="contained"
                type="submit"
                sx={{ width: '56px', height: '30px' }}
              >
                Apply
              </Button>
              <Button
                size="small"
                color="inherit"
                variant="outlined"
                type="reset"
                sx={{ width: '56px', height: '30px' }}
              >
                Reset
              </Button>
            </Box>
          </Stack>
          <Stack direction="column" spacing={1}>
            {children}
          </Stack>
        </Stack>
      </form>
    </Box>
  </Drawer>
);

export default Template;

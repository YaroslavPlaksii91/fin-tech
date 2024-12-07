import { ReactNode } from 'react';
import { Box, Stack, Typography, Button, IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Drawer from '../Drawer';

export interface TemplateProps {
  isOpen: boolean;
  isSubmitDisabled?: boolean;
  children: ReactNode;
  onReset: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

const Template = ({
  isOpen,
  children,
  isSubmitDisabled,
  onReset,
  onSubmit,
  onClose
}: TemplateProps) => (
  <Drawer
    anchor="right"
    open={isOpen}
    onClose={onClose}
    elevation={0}
    ModalProps={{
      BackdropProps: {
        style: { opacity: 0 }
      }
    }}
    sx={{
      '& .MuiDrawer-paper': {
        width: '384px'
      }
    }}
  >
    <Box sx={{ padding: '16px 24px' }}>
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
                disabled={isSubmitDisabled}
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

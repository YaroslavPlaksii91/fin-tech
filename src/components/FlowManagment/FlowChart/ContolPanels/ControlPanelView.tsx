import { Button, Typography } from '@mui/material';
import { NavLink, useParams } from 'react-router-dom';
import { Box } from '@mui/system';

import { StyledPanel } from './styled';

import routes from '@constants/routes';

const ControlPanelView = ({ flowName }: { flowName: string }) => {
  const { id } = useParams();
  return (
    <StyledPanel position="top-right">
      {/* TODO: add flow link */}
      <Box>
        <Typography variant="body1" mb={1}>
          {flowName}
        </Typography>
        <Typography variant="h4">{flowName}</Typography>
      </Box>
      <Button
        sx={{ marginLeft: 'auto' }}
        variant="contained"
        size="small"
        component={NavLink}
        to={id ? routes.underwriting.flow.edit(id) : '/'}
      >
        Edit Flow
      </Button>
    </StyledPanel>
  );
};

export default ControlPanelView;

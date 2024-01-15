import { Button } from '@mui/material';
import { NavLink, useParams } from 'react-router-dom';

import { StyledPanel } from './styled';

import { HexagonOutlinedIcon } from '@components/shared/Icons';
import routes from '@constants/routes';

const ControlPanelView = () => {
  const { id } = useParams();
  return (
    <StyledPanel position="top-right">
      <Button
        sx={{ marginLeft: 'auto' }}
        variant="contained"
        component={NavLink}
        to={id ? routes.underwriting.flow.details(id) : '/'}
        endIcon={<HexagonOutlinedIcon />}
      >
        View flow details
      </Button>
    </StyledPanel>
  );
};

export default ControlPanelView;

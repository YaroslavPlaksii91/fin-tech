import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { StyledPanel } from './styled';

import { HexagonOutlinedIcon } from '@components/shared/Icons';
import routes from '@constants/routes';

interface ControlPanelProps {
  flowId: string;
}

const ControlPanelView: React.FC<ControlPanelProps> = ({ flowId }) => (
  <StyledPanel position="top-right">
    <Button
      sx={{ marginLeft: 'auto' }}
      variant="contained"
      component={NavLink}
      to={`${routes.underwriting.flowList}/${flowId}/details`}
      endIcon={<HexagonOutlinedIcon />}
    >
      View flow details
    </Button>
  </StyledPanel>
);

export default ControlPanelView;

import { Button, Typography } from '@mui/material';
import { NavLink, useParams } from 'react-router-dom';
import { Box } from '@mui/system';

import { StyledPanel } from './styled';

import routes from '@constants/routes';
import { checkIsProductionFlow } from '@utils/helpers';
import { useAppSelector } from '@store/hooks';
import { selectFlowData } from '@store/flow/selectors';

const ControlPanelView = () => {
  const { id } = useParams();
  const isProductionFlow = checkIsProductionFlow();
  const flowData = useAppSelector(selectFlowData);

  return (
    <StyledPanel position="top-right">
      <Box>
        <Typography variant="body1" mb={1}>
          {isProductionFlow ? 'Flow on Production' : 'Draft Flow'}
        </Typography>
        <Typography variant="h4">{flowData.name}</Typography>
      </Box>
      {!isProductionFlow && (
        <Button
          sx={{ marginLeft: 'auto' }}
          variant="contained"
          size="small"
          component={NavLink}
          to={id ? routes.underwriting.flow.edit(id) : '/'}
        >
          Edit Flow
        </Button>
      )}
    </StyledPanel>
  );
};

export default ControlPanelView;

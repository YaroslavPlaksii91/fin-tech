import Typography from '@mui/material/Typography';

import { StyledGridOverlay } from './styled';

const CustomNoResultsOverlay = () => (
  <StyledGridOverlay>
    <Typography variant="body1">No Results.</Typography>
  </StyledGridOverlay>
);

export default CustomNoResultsOverlay;

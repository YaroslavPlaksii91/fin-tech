import React from 'react';
import Typography from '@mui/material/Typography';

import { StyledGridOverlay } from './styled';

const CustomNoResultsOverlay: React.FC = () => (
  <StyledGridOverlay>
    <Typography variant="body1">No Results.</Typography>
  </StyledGridOverlay>
);

export default CustomNoResultsOverlay;

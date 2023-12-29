import { Button, Stack, Typography } from '@mui/material';

import { palette } from '../../../themeConfig';

import { StyledContainer } from './styled';

import { FlowNode } from '@domain/flow';

interface StepConfigureViewProps {
  step: FlowNode;
}

const StepConfigureView: React.FC<StepConfigureViewProps> = ({ step }) => (
  <StyledContainer>
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Stack>
        <Typography variant="h2">{step.data.name}</Typography>
        <Typography variant="body2" color={palette.gray}>
          A Champion Challenger is an object that allows you to split traffic
          into several groups and run experiment.
        </Typography>
      </Stack>
      <Button
        sx={{ margin: '0px 8px 0 auto' }}
        variant="contained"
        color="secondary"
      >
        Discard
      </Button>
      <Button variant="contained">Apply changes</Button>
    </Stack>
  </StyledContainer>
);

export default StepConfigureView;

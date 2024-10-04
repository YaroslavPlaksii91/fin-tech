import { Stack, Typography } from '@mui/material';

import StepBreadcrumbs from './StepBreadcrumbs';

import { FlowNode } from '@domain/flow';

interface StepDetailsHeaderProps {
  step: FlowNode;
  title: string;
  details?: string;
}

const StepDetailsHeader: React.FC<StepDetailsHeaderProps> = ({
  step,
  title,
  details
}) => (
  <>
    <Stack spacing={2}>
      <StepBreadcrumbs stepId={step.id} title={title} />
    </Stack>
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Stack spacing={1} mb={2}>
        <Typography variant="h4">{title}</Typography>
        {details && (
          <Typography color="gray" variant="body1">
            {details}
          </Typography>
        )}
      </Stack>
    </Stack>
  </>
);

export default StepDetailsHeader;

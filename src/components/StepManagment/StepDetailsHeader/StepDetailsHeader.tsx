import { Button, Stack, Typography } from '@mui/material';

import StepBreadcrumbs from './StepBreadcrumbs';

import LoadingButton from '@components/shared/LoadingButton';
import { FlowNode, IFlow } from '@domain/flow.ts';

interface StepDetailsHeaderProps {
  flow: IFlow;
  step: FlowNode;
  title: string;
  details?: string;
  isActionContainerVisible?: boolean;
  disabled?: boolean;
  isSubmitting?: boolean;
  onDiscard?: () => void;
  buttonType?: 'button' | 'submit' | undefined;
  onApplyChangesClick?: () => void;
}

const StepDetailsHeader: React.FC<StepDetailsHeaderProps> = ({
  flow,
  step,
  title,
  details,
  onDiscard,
  disabled,
  isActionContainerVisible = true,
  isSubmitting,
  buttonType,
  onApplyChangesClick
}) => (
  <>
    <Stack spacing={2}>
      <StepBreadcrumbs flow={flow} stepId={step.id} title={title} />
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
      {isActionContainerVisible && (
        <>
          <Button
            sx={{ margin: '0px 8px 0 auto' }}
            variant="contained"
            color="secondary"
            onClick={onDiscard}
          >
            Discard
          </Button>
          <LoadingButton
            disabled={disabled}
            loading={Boolean(isSubmitting)}
            type={buttonType}
            variant="contained"
            sx={{ textWrap: 'nowrap' }}
            onClick={() => (onApplyChangesClick ? onApplyChangesClick() : null)}
          >
            Apply changes
          </LoadingButton>
        </>
      )}
    </Stack>
  </>
);

export default StepDetailsHeader;

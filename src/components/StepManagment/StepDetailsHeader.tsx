import { Breadcrumbs, Button, Link, Stack, Typography } from '@mui/material';
import { Link as RRLink } from 'react-router-dom';
import { useMemo } from 'react';

import LoadingButton from '@components/shared/LoadingButton';
import { theme } from '@theme';
import routes from '@constants/routes.ts';
import { IFlow } from '@domain/flow.ts';
// import { useStep } from '@contexts/StepContext.tsx';

interface StepDetailsHeaderProps {
  title: string;
  details?: string;
  isActionContainerVisible?: boolean;
  disabled?: boolean;
  isSubmitting?: boolean;
  onDiscard?: () => void;
  buttonType?: 'button' | 'submit' | undefined;
  onApplyChangesClick?: () => void;
  flow?: IFlow;
}

const StepDetailsHeader: React.FC<StepDetailsHeaderProps> = ({
  flow,
  title,
  details,
  onDiscard,
  disabled,
  isActionContainerVisible = true,
  isSubmitting,
  buttonType,
  onApplyChangesClick
}) => {
  // const { setActiveStepId } = useStep();

  const breadcrumbs = useMemo(
    () =>
      [
        <Link
          underline="hover"
          key="main-flow"
          variant="body1"
          component={RRLink}
          color={theme.palette.text.secondary}
          to={routes.index}
        >
          Home
        </Link>,
        flow ? (
          <Link
            underline="hover"
            key="main-flow"
            variant="body1"
            component={RRLink}
            color={theme.palette.text.secondary}
            to={routes.underwriting.flow.edit(flow.id)}
            // onClick={() => setActiveStepId(null)}
          >
            {flow.data.name}
          </Link>
        ) : null,
        <Typography
          key="data-dictionary"
          variant="body1"
          color={theme.palette.text.primary}
        >
          Edit Step: {title}
        </Typography>
      ].filter((i) => i),
    [flow?.data?.name, flow?.id]
    // [flow?.data?.name, flow?.id, setActiveStepId]
  );

  return (
    <>
      <Stack spacing={2} sx={{ padding: '16px 24px 8px' }}>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ padding: '0 24px 16px' }}
      >
        <Stack>
          <Typography variant="h4" mb={1}>
            {title}
          </Typography>
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
              onClick={() =>
                onApplyChangesClick ? onApplyChangesClick() : null
              }
            >
              Apply changes
            </LoadingButton>
          </>
        )}
      </Stack>
    </>
  );
};

export default StepDetailsHeader;

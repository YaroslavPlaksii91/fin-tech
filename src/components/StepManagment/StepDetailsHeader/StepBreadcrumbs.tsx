import { Breadcrumbs } from '@mui/material';

import { createBreadcrumbs } from './utils';

import { useActiveStep } from '@contexts/StepContext';
import { useAppSelector } from '@store/hooks';
import { selectFlow } from '@store/flow/selectors';

interface StepDetailsHeaderProps {
  stepId: string;
  title: string;
}

const StepBreadcrumbs: React.FC<StepDetailsHeaderProps> = ({
  stepId,
  title
}) => {
  const { flow } = useAppSelector(selectFlow);
  const { setActiveStep } = useActiveStep();

  const breadcrumbs = createBreadcrumbs({
    flow,
    title,
    id: stepId,
    setActiveStep
  });

  return (
    <Breadcrumbs separator="/" aria-label="breadcrumb">
      {breadcrumbs}
    </Breadcrumbs>
  );
};

export default StepBreadcrumbs;

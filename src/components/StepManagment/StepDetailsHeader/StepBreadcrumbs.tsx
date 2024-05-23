import { Breadcrumbs } from '@mui/material';

import createBreadcrumbs from './utils';

import { IFlow } from '@domain/flow.ts';
import { useActiveStep } from '@contexts/StepContext.tsx';

interface StepDetailsHeaderProps {
  flow: IFlow;
  stepId: string;
  title: string;
}

const StepBreadcrumbs: React.FC<StepDetailsHeaderProps> = ({
  flow,
  stepId,
  title
}) => {
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

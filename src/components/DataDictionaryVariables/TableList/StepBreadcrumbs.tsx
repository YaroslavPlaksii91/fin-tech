import { Box, Breadcrumbs, Typography } from '@mui/material';

import { FlowNode } from '@domain/flow';
import { theme } from '@theme';
import { STEP_ICONS } from '@constants/common';
import { buildPath } from '@components/StepManagment/StepDetailsHeader/utils';

interface StepDetailsHeaderProps {
  stepId: string;
  flowNodes: FlowNode[];
  handleClick: ({
    subFlowId,
    stepId
  }: {
    subFlowId: string | null;
    stepId: string | null;
  }) => void;
}

type CreateBreadcrumbsParams = {
  id: string;
  flowNodes: FlowNode[];
  handleClick: ({
    subFlowId,
    stepId
  }: {
    subFlowId: string | null;
    stepId: string | null;
  }) => void;
};

const StepBreadcrumbs: React.FC<StepDetailsHeaderProps> = ({
  stepId,
  flowNodes,
  handleClick
}) => {
  const breadcrumbs = createBreadcrumbs({
    id: stepId,
    flowNodes,
    handleClick
  });

  return (
    <Breadcrumbs separator="/" aria-label="breadcrumb">
      {breadcrumbs}
    </Breadcrumbs>
  );
};

const createBreadcrumbs = ({
  id,
  flowNodes,
  handleClick
}: CreateBreadcrumbsParams) => {
  const path = buildPath(id, flowNodes);

  if (!path) return null;

  const breadcrumbs = [];

  path.slice(0, -1).forEach((node) => {
    breadcrumbs.push(
      <Box key={node.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {STEP_ICONS[node.data.stepType]}
        <Typography
          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          variant="body1"
          color={theme.palette.info.main}
          onClick={() => handleClick({ subFlowId: node.id, stepId: null })}
        >
          {node.data.name}
        </Typography>
      </Box>
    );
  });

  const lastNode = path.pop();
  breadcrumbs.push(
    <Box key="edit-step" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {lastNode && STEP_ICONS[lastNode?.data.stepType]}
      <Typography
        variant="body1"
        color={theme.palette.info.main}
        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
        onClick={() => {
          handleClick({
            subFlowId: lastNode?.parentNode || null,
            stepId: lastNode?.id || null
          });
        }}
      >
        {lastNode?.data.name}
      </Typography>
    </Box>
  );

  return breadcrumbs.filter((i) => i);
};

export default StepBreadcrumbs;

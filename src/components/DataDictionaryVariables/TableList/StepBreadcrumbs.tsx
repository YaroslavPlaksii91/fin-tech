import { Box, Breadcrumbs, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { FlowNode } from '@domain/flow';
import { theme } from '@theme';
import routes from '@constants/routes';
import { STEP_ICONS } from '@constants/common';
import { buildPath } from '@components/StepManagment/StepDetailsHeader/utils';

interface StepDetailsHeaderProps {
  stepId: string;
  flowId: string;
  flowNodes: FlowNode[];
}

const StepBreadcrumbs: React.FC<StepDetailsHeaderProps> = ({
  stepId,
  flowNodes,
  flowId
}) => {
  const navigate = useNavigate();

  const handleClick = ({
    subFlowId,
    stepId
  }: {
    subFlowId: string | null;
    stepId: string | null;
  }) => {
    navigate(routes.underwriting.flow.edit(flowId), {
      state: { subFlowId, stepId }
    });
  };

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

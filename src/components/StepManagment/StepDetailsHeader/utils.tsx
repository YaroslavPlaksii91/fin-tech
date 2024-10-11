import { Link, Typography } from '@mui/material';
import { Link as RRLink } from 'react-router-dom';

import { StepBreadcrumbsLink } from './styled';

import { theme } from '@theme';
import routes from '@constants/routes';
import { FlowNode, IFlow } from '@domain/flow';

type CreateBreadcrumbsParams = {
  id: string;
  flow: IFlow;
  title: string;
  setActiveStep: ({
    stepId,
    subFlowId
  }: {
    stepId: null | string;
    subFlowId: null | string;
  }) => void;
};

const createBreadcrumbs = ({
  id,
  flow,
  title,
  setActiveStep
}: CreateBreadcrumbsParams) => {
  const path = buildPath(id, flow.nodes);

  if (!path) return null;

  const breadcrumbs = [
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
    <StepBreadcrumbsLink
      key="main-flow"
      variant="body1"
      color={theme.palette.text.secondary}
      onClick={() => setActiveStep({ subFlowId: null, stepId: null })}
    >
      {flow.data.name}
    </StepBreadcrumbsLink>
  ];

  path.slice(0, -1).forEach((node) => {
    breadcrumbs.push(
      <StepBreadcrumbsLink
        key={node.id}
        variant="body1"
        color={theme.palette.text.secondary}
        onClick={() => {
          setActiveStep({ subFlowId: node.id, stepId: null });
        }}
      >
        {node.data.name}
      </StepBreadcrumbsLink>
    );
  });

  breadcrumbs.push(
    <Typography
      key="edit-step"
      variant="body1"
      color={theme.palette.text.primary}
    >
      {title}
    </Typography>
  );

  return breadcrumbs.filter((i) => i);
};

const buildPath = (
  id: string,
  nodes: FlowNode[],
  subFlowId?: string
): FlowNode[] | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return [{ ...node, parentNode: subFlowId }];
    } else if (node.data.nodes) {
      const result = buildPath(id, node.data.nodes, node.id);
      if (result) {
        return [{ ...node, parentNode: subFlowId }, ...result];
      }
    }
  }
  return null;
};

export { createBreadcrumbs, buildPath };

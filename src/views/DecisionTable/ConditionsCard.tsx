import React from 'react';
import { Card, Typography, Box } from '@mui/material';

import { getFormattedRules } from './utils';

import { CaseEntry } from '@views/DecisionTable/types';
import { customBoxShadows, theme } from '@theme';
import { FlowNode } from '@domain/flow';

interface ConditionsCardProps {
  caseEntries: CaseEntry[];
  nodes: FlowNode[];
}

const ConditionsCard = ({ caseEntries, nodes }: ConditionsCardProps) => {
  const rules = getFormattedRules(caseEntries);

  const renderItems = (items: string[]) =>
    items.map((item, idx) => (
      <React.Fragment key={idx}>
        <Typography variant="caption" component="span">
          {item}
        </Typography>
        {idx < items.length - 1 && renderConjunction('and')}
      </React.Fragment>
    ));

  const renderStep = (edgeId: string | null) => {
    const nodeType = nodes.find((node) => node.id === edgeId)?.data.name || '';
    return (
      <Typography variant="caption" component="span">
        {`Step goes to ${nodeType}`}
      </Typography>
    );
  };

  const renderConjunction = (conjunction: string) => (
    <Typography
      variant="caption"
      component="span"
      color={theme.palette.text.secondary}
    >
      {` ${conjunction} `}
    </Typography>
  );

  return (
    <Card
      sx={{
        ...theme.typography.caption,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        mt: 2,
        padding: '8px 16px',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '16px',
        boxShadow: customBoxShadows.elevation1
      }}
    >
      {rules.map((entry, idx) => (
        <Box key={idx}>
          <Typography
            variant="caption"
            component="span"
            color={theme.palette.text.secondary}
          >
            {`${entry.keyword} `}
          </Typography>
          {renderItems(entry.conditions)}
          {idx < rules.length - 1 && renderConjunction('then')}
          {renderItems(entry.actions)}
          {entry.actions.length > 0 && renderConjunction('and')}
          {renderStep(entry.edgeId)}
        </Box>
      ))}
    </Card>
  );
};

export default ConditionsCard;

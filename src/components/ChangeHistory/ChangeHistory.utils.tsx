import React from 'react';
import { Box, IconButton, Breadcrumbs, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import LineChartDotsSquareIcon from '@icons/lineChartDotsSquare.svg';
import BezierIcon from '@icons/bezier.svg';
import {
  ChangeHistoryDifference,
  ChangeTypeEnum
} from '@domain/changeHistory.ts';
import { theme } from '@theme';
import EyeIcon from '@icons/eye.svg';
import {
  StyledTableRow,
  StyledTableCell
} from '@components/shared/Table/styled';
import routes from '@constants/routes';
import { PRODUCTION_FLOW_ID } from '@constants/common';

// const getPathLink = (id: string, index: number) => {
//   if (index === 0) {
//     return `${routes.underwriting.flow.list(id)}`;
//   } else {
//     // @TODO: Return link to open flow step
//     return '#';
//   }
// };

const getActionType = (row: ChangeHistoryDifference) => {
  const changeType = ChangeTypeEnum[row.changeType];
  if (row.sourceName && row.targetName) {
    return `${changeType} Link`;
  }

  if (row.stepType) {
    const newTag = changeType === ChangeTypeEnum[0] ? 'New' : '';
    return `${changeType} ${newTag} ${row.stepType}`;
  }
  return changeType;
};

const getName = (row: ChangeHistoryDifference) => {
  const name = '-';
  if (row.sourceName && row.targetName) {
    return `From "${row.sourceName}" to "${row.targetName}"`;
  }

  if (row.name) {
    return row.name;
  }

  return name;
};

export function Row(props: {
  row: ChangeHistoryDifference;
  handleRowClick: (rowId: string) => void;
  index: number;
}) {
  const { row, handleRowClick, index } = props;
  const navigate = useNavigate();

  const rowParity = (index + 1) % 2 === 0 ? 'even' : 'odd';

  const handleClick = (id: string, index: number) => {
    if (index == 0) {
      navigate(routes.underwriting.flow.list(PRODUCTION_FLOW_ID));
    } else {
      navigate(routes.underwriting.flow.list(PRODUCTION_FLOW_ID), {
        state: { subFlowId: id, stepId: null }
      });
    }
  };

  return (
    <React.Fragment>
      <StyledTableRow parity={rowParity}>
        <StyledTableCell>{getActionType(row)}</StyledTableCell>
        <StyledTableCell>{getName(row)}</StyledTableCell>
        <StyledTableCell>
          <Breadcrumbs>
            {row.path.map((part, index) => (
              <Box
                key={part.id + index}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                {index === 0 ? (
                  <BezierIcon
                    width="18px"
                    height="18px"
                    color={theme.palette.primary.main}
                  />
                ) : (
                  <LineChartDotsSquareIcon
                    width="18px"
                    height="18px"
                    color={theme.palette.primary.main}
                  />
                )}
                <Typography
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                  variant="body2"
                  color={theme.palette.info.main}
                  onClick={() => handleClick(part.id, index)}
                >
                  {part.name}
                </Typography>
              </Box>
            ))}
          </Breadcrumbs>
        </StyledTableCell>
        <StyledTableCell width="40px">
          <IconButton
            sx={{ padding: 0 }}
            aria-label="view row"
            size="small"
            onClick={() => {
              handleRowClick(row.id);
            }}
          >
            <EyeIcon />
          </IconButton>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
}

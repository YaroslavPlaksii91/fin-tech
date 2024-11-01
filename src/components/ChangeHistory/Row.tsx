import { Box, Breadcrumbs, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { getActionType, getName } from './utils';
import { StyledTableCell } from './styled';
import { BreadcrumbItem, FirstBreadcrumbItem } from './BreadCrumbItems';

import { StyledTableRow } from '@components/shared/Table/styled';
import { ChangeHistoryDifference } from '@domain/changeHistory';
import { PRODUCTION_FLOW_ID } from '@constants/common';
import routes from '@constants/routes';
import EyeIcon from '@icons/eye.svg';

interface RowProps {
  row: ChangeHistoryDifference;
  isFirstChangeHistoryItem: boolean;
  handleRowClick: (rowId: string) => void;
  index: number;
}

const Row = ({
  row,
  handleRowClick,
  index,
  isFirstChangeHistoryItem
}: RowProps) => {
  const navigate = useNavigate();

  const rowParity = index % 2 === 0 ? 'even' : 'odd';

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
              {isFirstChangeHistoryItem ? (
                <FirstBreadcrumbItem
                  part={part}
                  index={index}
                  handleClick={handleClick}
                />
              ) : (
                <BreadcrumbItem part={part} index={index} />
              )}
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
  );
};

export default Row;

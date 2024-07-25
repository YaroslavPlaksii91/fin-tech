import React from 'react';
import {
  Box,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Collapse,
  Breadcrumbs,
  Typography
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableCell from '@mui/material/TableCell';
import ReactDiffViewer from 'react-diff-viewer';

import LineChartDotsSquareIcon from '@icons/lineChartDotsSquare.svg';
import BezierIcon from '@icons/bezier.svg';
import { StyledTableCell } from '@components/ChangeHistory/styled.ts';
import {
  ChangeHistoryDifference,
  ChangeTypeEnum
} from '@domain/changeHistory.ts';
// import routes from '@constants/routes.ts';
import { theme } from '@theme';

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

export function Row(props: { row: ChangeHistoryDifference }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell width="20%" component="th" scope="row">
          {/* {ChangeTypeEnum[row.changeType]} */}
          {getActionType(row)}
        </StyledTableCell>
        <StyledTableCell width="30%" component="th" scope="row">
          {
            // row.name || '-'
            getName(row)
          }
        </StyledTableCell>
        <StyledTableCell width="60%" component="th" scope="row">
          <Breadcrumbs>
            {row.path.map((part, index) => (
              // <React.Fragment key={part.id + index}>
              //   <Link path={getPathLink(part.id, index)} label={part.name} />
              //   {index !== row.path.length - 1 && <span>&gt;</span>}
              // </React.Fragment>
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
                >
                  {part.name}
                </Typography>
              </Box>
            ))}
          </Breadcrumbs>
        </StyledTableCell>
        <StyledTableCell width={24}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
      </TableRow>
      <TableRow>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Before</TableCell>
                    <TableCell>After</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <StyledTableCell
                      colSpan={2}
                      width="50%"
                      component="th"
                      scope="row"
                    >
                      <ReactDiffViewer
                        hideLineNumbers
                        oldValue={row.before || ''}
                        newValue={row.after || ''}
                        splitView={true}
                      />
                    </StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </React.Fragment>
  );
}

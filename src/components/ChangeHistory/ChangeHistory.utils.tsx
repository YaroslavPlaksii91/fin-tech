import React from 'react';
import {
  Box,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Collapse
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableCell from '@mui/material/TableCell';
import ReactDiffViewer from 'react-diff-viewer';

import { StyledTableCell } from '@components/ChangeHistory/styled.ts';
import {
  ChangeHistoryDifference,
  ChangeTypeEnum
} from '@domain/changeHistory.ts';
import Link from '@components/shared/Link/Link.tsx';
import routes from '@constants/routes.ts';

const getPathLink = (id: string, index: number) => {
  if (index === 0) {
    return `${routes.underwriting.flow.list(id)}`;
  } else {
    // @TODO: Return link to open flow step
    return '#';
  }
};

export function Row(props: { row: ChangeHistoryDifference }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell component="th" scope="row">
          {ChangeTypeEnum[row.changeType]}
        </StyledTableCell>
        <StyledTableCell align="left">{row.name || '-'}</StyledTableCell>
        <StyledTableCell align="left">
          {row.path.map((part, index) => (
            <React.Fragment key={part.id + index}>
              <Link path={getPathLink(part.id, index)} label={part.name} />
              {index !== row.path.length - 1 && <span>&gt;</span>}
            </React.Fragment>
          ))}
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

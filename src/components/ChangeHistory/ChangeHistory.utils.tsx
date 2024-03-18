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
import { ChangeHistoryDifference } from '@domain/changeHistory.ts';

export function Row(props: { row: ChangeHistoryDifference }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell component="th" scope="row">
          {/* @TODO: What is that? */}
          {row.changeType}
        </StyledTableCell>
        <StyledTableCell align="left">{row.name}</StyledTableCell>
        <StyledTableCell align="left">{row.path.join(' > ')}</StyledTableCell>
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

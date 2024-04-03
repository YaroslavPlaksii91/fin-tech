import { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  Pagination,
  Typography,
  Stack
} from '@mui/material';

import { columns } from './types';
import { StyledTableContainer } from './styled';

import { LayoutContainer } from '@components/Layouts/MainLayout.tsx';
import Logger from '@utils/logger.ts';
import { reportingService } from '@services/lead-requests-reports';
import LoadingFullscreen from '@components/shared/LoadingFullscreen';
import {
  StyledPaper,
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';

const pageSize = 10;

const LeadRequestsReportsPage = () => {
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async (page: number) => {
    try {
      setLoading(true);
      const res = await reportingService.getLeadRequestsReports(page, pageSize);
      setData(res);
    } catch (e) {
      Logger.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchList(page);
  }, [page]);

  const handleChange = (_event, value) => {
    setPage(value);
  };

  return (
    <LayoutContainer>
      <Stack sx={{ width: '100%', overflow: 'hidden', padding: '16px 32px' }}>
        <Typography pb={3} variant="h1">
          Lead requests
        </Typography>
        <StyledPaper>
          <StyledTableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <StyledTableRow>
                  {columns.map((column) => (
                    <StyledTableCell key={column.id}>
                      {column.label}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <LoadingFullscreen />
                  </TableRow>
                ) : (
                  data?.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        Name
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.correlationId}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
          <Pagination
            sx={{
              position: 'sticky',
              background: 'gray',
              left: 0,
              right: 0,
              bottom: 0
            }}
            count={Math.ceil(455 / 10)}
            page={page}
            onChange={handleChange}
          />
        </StyledPaper>
      </Stack>
    </LayoutContainer>
  );
};

export default LeadRequestsReportsPage;

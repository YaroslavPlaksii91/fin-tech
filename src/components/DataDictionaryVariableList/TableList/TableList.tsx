import { TableHead, TableBody, IconButton } from '@mui/material';
import AddBoxOutlined from '@mui/icons-material/AddBoxOutlined';

import { VARIABLES_TABS } from '../constants';

import { StyledPaper, StyledTableContainer, StyledTable } from './styled';

import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';

const TableList = ({
  data,
  tabName
}: {
  data: DataDictionaryVariable[] | UserDefinedVariable[];
  tabName: VARIABLES_TABS;
}) => (
  <StyledPaper>
    <StyledTableContainer>
      <StyledTable>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell> Variable Name</StyledTableCell>
            <StyledTableCell> Data Type</StyledTableCell>
            <StyledTableCell> Default value</StyledTableCell>
            <StyledTableCell> Description</StyledTableCell>
            {tabName !== VARIABLES_TABS.laPMSVariables && (
              <StyledTableCell align="right">
                <IconButton
                  onClick={() => 'click'}
                  edge="end"
                  aria-label="add"
                  sx={{ padding: 0, marginRight: 0 }}
                >
                  <AddBoxOutlined fontSize="small" />
                </IconButton>
              </StyledTableCell>
            )}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data.map((variable, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{variable.name}</StyledTableCell>
              <StyledTableCell>{variable.dataType}</StyledTableCell>
              <StyledTableCell>{variable.defaultValue}</StyledTableCell>
              <StyledTableCell>{variable.description}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  </StyledPaper>
);

export default TableList;

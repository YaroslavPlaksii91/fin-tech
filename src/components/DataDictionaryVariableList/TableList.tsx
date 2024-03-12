import { TableHead, TableBody } from '@mui/material';

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
  data
}: {
  data: DataDictionaryVariable[] | UserDefinedVariable[];
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

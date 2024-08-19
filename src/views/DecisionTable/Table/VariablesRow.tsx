import { useState } from 'react';
import { TableCell } from '@mui/material';
import { lightGreen } from '@mui/material/colors';

import { VariableColumnData } from '../types';
import { getHeaderCellBgColor, filterVariablesByUsageMode } from '../utils';
import VariableInput from '../VariableInput';
import { STEP } from '../constants';

import TrashIcon from '@icons/trash.svg';
import AddIcon from '@icons/plusSquare.svg';
import GridSquarePlusIcon from '@icons/gridSquarePlus.svg';
import { DataDictionaryVariable, Variable } from '@domain/dataDictionary';
import { StyledTableRow } from '@components/shared/Table/styled';
import DataDictionaryDialog from '@components/DataDictionaryVariables/DataDictionaryDialog/DataDictionaryDialog';

interface VariablesRowProps {
  columns: VariableColumnData[];
  hasUserPermission: boolean;
  variables: Record<string, Variable[]>;
  integrationData: Record<string, Variable[]>;
  handleChangeColumnVariable: (
    column: VariableColumnData
  ) => (newVariable: DataDictionaryVariable) => void;
  handleAddColumn: (column: VariableColumnData) => void;
  handleDeleteColumn: (column: VariableColumnData) => void;
}

const VariablesRow = ({
  hasUserPermission,
  columns,
  variables,
  integrationData,
  handleChangeColumnVariable,
  handleAddColumn,
  handleDeleteColumn
}: VariablesRowProps) => {
  const [selectedColumn, setSelectedColumn] =
    useState<VariableColumnData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleAddVariable = () => {
    setIsDialogOpen(true);
    setIsMenuOpen(false);
  };

  const handleAddNewColumn = () => {
    if (selectedColumn) handleAddColumn(selectedColumn);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    if (selectedColumn) handleDeleteColumn(selectedColumn);
    setIsMenuOpen(false);
  };

  const getMenuItems = (column: VariableColumnData) => {
    const columnsCount = columns.filter(
      ({ category }) => category === column.category && column.name !== STEP
    ).length;

    return [
      {
        key: 'add-variable-action',
        disabled: column.name === STEP,
        onClick: handleAddVariable,
        icon: <AddIcon height={24} width={24} />,
        text: `Add ${column.category === 'conditions' ? 'Input' : 'Output'} Variable`
      },
      {
        key: 'add-column-action',
        disabled: false,
        onClick: handleAddNewColumn,
        icon: <GridSquarePlusIcon />,
        text: 'Add Column'
      },
      {
        key: 'delete-column-action',
        disabled: columnsCount === 1 || column.name === STEP,
        onClick: handleDelete,
        icon: <TrashIcon />,
        text: 'Delete Column'
      }
    ];
  };

  const handleClick = (column: VariableColumnData) => () => {
    setIsMenuOpen(true);
    setSelectedColumn(column);
  };

  return (
    <StyledTableRow>
      {columns.map((column, columnIndex) => (
        <TableCell
          width={340}
          key={columnIndex}
          sx={{
            bgcolor: getHeaderCellBgColor(column.category)
          }}
        >
          <VariableInput
            fullWidth
            readOnly
            sx={{
              minWidth: '300px',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
            size="small"
            open={
              isMenuOpen &&
              column.index === selectedColumn?.index &&
              column.category === selectedColumn?.category
            }
            value={column.name}
            menuItems={getMenuItems(column)}
            onClick={handleClick(column)}
            showActionButton={hasUserPermission}
          />
        </TableCell>
      ))}
      <TableCell sx={{ bgcolor: lightGreen[50], width: 0 }} />
      {selectedColumn ? (
        <DataDictionaryDialog
          data={filterVariablesByUsageMode(variables, selectedColumn.category)}
          integrationData={filterVariablesByUsageMode(
            integrationData,
            selectedColumn.category
          )}
          title="Add Variable"
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleChangeColumnVariable(selectedColumn)}
          setSelectedObjectPropertyFunction={(object, property) => ({
            ...property,
            // Technically is not correct source type, but for calculations this is backend requirement -
            // for now this row brake the decision table flow with -> user vars
            sourceName: object.name,
            sourceType: object.sourceType
          })}
        />
      ) : null}
    </StyledTableRow>
  );
};

export default VariablesRow;

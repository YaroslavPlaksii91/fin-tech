import { useState } from 'react';
import { TableCell } from '@mui/material';
import { lightGreen } from '@mui/material/colors';

import { ColumnData } from '../types';
import { getHeaderCellBgColor, filterVariablesByUsageMode } from '../utils';
import { STEP } from '../constants';

import VariableInput from './VariableInput';

import TrashIcon from '@icons/trash.svg';
import AddIcon from '@icons/plusSquare.svg';
import EditIcon from '@icons/editPencil.svg';
import GridSquarePlusIcon from '@icons/gridSquarePlus.svg';
import {
  DataDictionaryVariable,
  DataDictionaryVariables
} from '@domain/dataDictionary';
import { StyledTableRow } from '@components/shared/Table/styled';
import VariablesDialog from '@components/shared/VariablesDialog';

interface VariablesRowProps {
  columns: ColumnData[];
  hasUserPermission: boolean;
  variables: DataDictionaryVariables;
  integrationData: DataDictionaryVariables;
  handleChangeColumn: (
    column: ColumnData,
    variable: DataDictionaryVariable
  ) => void;
  handleAddColumn: (column: ColumnData) => void;
  handleDeleteColumn: (column: ColumnData) => void;
}

const VariablesRow = ({
  hasUserPermission,
  columns,
  variables,
  integrationData,
  handleChangeColumn,
  handleAddColumn,
  handleDeleteColumn
}: VariablesRowProps) => {
  const [selectedColumn, setSelectedColumn] = useState<ColumnData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleAddVariable = () => {
    setIsDialogOpen(true);
  };

  const handleAddNewColumn = () => {
    if (selectedColumn) handleAddColumn(selectedColumn);
  };

  const handleDelete = () => {
    if (selectedColumn) handleDeleteColumn(selectedColumn);
  };

  const getMenuItems = (column: ColumnData) => {
    const columnsCount = columns.filter(
      ({ category }) => category === column.category && column.name !== STEP
    ).length;

    return [
      {
        key: 'add-variable-action',
        disabled: column.name === STEP,
        onClick: handleAddVariable,
        icon: column.name ? <AddIcon height={24} width={24} /> : <EditIcon />,
        text: `${column.name ? 'Edit' : 'Add'} ${column.category === 'conditions' ? 'Input' : 'Output'} Variable`
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

  const handleClick = (column: ColumnData) => () => {
    setSelectedColumn(column);
  };

  const handleConfirm = (selectedVariable: DataDictionaryVariable) => {
    handleChangeColumn(selectedColumn!, selectedVariable);
    handleCloseDialog();
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
            value={column.name}
            menuItems={getMenuItems(column)}
            onClick={handleClick(column)}
            showActionButton={hasUserPermission}
          />
        </TableCell>
      ))}
      <TableCell sx={{ bgcolor: lightGreen[50], width: 0 }} />
      {selectedColumn ? (
        <VariablesDialog
          data={filterVariablesByUsageMode(variables, selectedColumn.category)}
          integrationData={
            selectedColumn.category === 'actions' ? undefined : integrationData
          }
          title="Add Variable"
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirm}
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

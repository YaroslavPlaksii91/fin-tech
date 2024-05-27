import { IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';

import MoreHorizontalIcon from '@icons/moreHorizontal.svg';
import { HexagonOutlinedIcon } from '@components/shared/Icons';

type VariableInputProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  variableActionTitle: string;
  handleSelectColumn?: () => void;
  handleAddVariable: () => void;
  handleAddNewColumn?: () => void;
  handleDeleteColumn?: () => void;
  handleClickOnMenu: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  handleCloseMenu: () => void;
  isAddVariableDisabled: boolean;
  isDeleteDisabled: boolean;
};

const VariableInput = ({
  open,
  anchorEl,
  variableActionTitle,
  handleAddVariable,
  handleAddNewColumn,
  handleDeleteColumn,
  handleClickOnMenu,
  handleCloseMenu,
  isAddVariableDisabled,
  isDeleteDisabled,
  ...rest
}: VariableInputProps & OutlinedInputProps) => (
  <OutlinedInput
    {...rest}
    placeholder="Choose the variable"
    endAdornment={
      <>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          size="small"
          onClick={handleClickOnMenu}
        >
          <MoreHorizontalIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
        >
          <MenuItem
            key="add-variable-action"
            onClick={handleAddVariable}
            disabled={isAddVariableDisabled}
          >
            <ListItemIcon>
              <HexagonOutlinedIcon size="16px" />
            </ListItemIcon>
            {variableActionTitle}
          </MenuItem>
          <MenuItem key="add-column-action" onClick={handleAddNewColumn}>
            <ListItemIcon>
              <HexagonOutlinedIcon size="16px" />
            </ListItemIcon>
            Add Column
          </MenuItem>
          <MenuItem
            key="delete-column-action"
            onClick={handleDeleteColumn}
            disabled={isDeleteDisabled}
          >
            <ListItemIcon>
              <HexagonOutlinedIcon size="16px" />
            </ListItemIcon>
            Delete Column
          </MenuItem>
        </Menu>
      </>
    }
  />
);

export default VariableInput;

import { IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { CATEGORIES } from '../constants';

import { HexagonOutlinedIcon } from '@components/shared/Icons';

type AutocompleteInputProps = {
  open: boolean;
  columnId: string;
  columnClickedId?: string;
  anchorEl: HTMLElement | null;
  index: number;
  category: CATEGORIES;
  handleAddNewColumn?: (index: number) => void;
  handleDeleteColumn?: (columnId: string) => void;
  handleClickOnMenu: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    columnId: string
  ) => void;
  handleCloseMenu: () => void;
  isTheLastCategoryColumn: boolean;
};

export const AutocompleteInput = ({
  open,
  columnId,
  columnClickedId,
  anchorEl,
  index,
  category,
  handleAddNewColumn,
  handleDeleteColumn,
  handleClickOnMenu,
  handleCloseMenu,
  isTheLastCategoryColumn,
  ...rest
}: AutocompleteInputProps & TextFieldProps) => (
  <TextField
    {...rest}
    placeholder="Choose the variable"
    InputProps={{
      ...rest.InputProps,
      endAdornment: category !== CATEGORIES.ElseActions && (
        <>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            size="small"
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleClickOnMenu(event, columnId)
            }
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={open && columnId === columnClickedId}
            onClose={handleCloseMenu}
          >
            <MenuItem
              key="add-column-action"
              onClick={() => handleAddNewColumn?.(index)}
            >
              <ListItemIcon>
                <HexagonOutlinedIcon size="16px" />
              </ListItemIcon>
              Add Column
            </MenuItem>

            <MenuItem
              key="delete-column-action"
              onClick={() => handleDeleteColumn?.(columnId)}
              disabled={isTheLastCategoryColumn}
            >
              <ListItemIcon>
                <HexagonOutlinedIcon size="16px" />
              </ListItemIcon>
              Delete Column
            </MenuItem>
          </Menu>
        </>
      )
    }}
  />
);

import { Stack, IconButton, Menu, MenuItem } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { CATEGORIES } from '../constants';

import { HexagonOutlinedIcon } from '@components/shared/Icons';

type AutocompleteInputProps = {
  open: boolean;
  columnId: string;
  columnClickedId: string;
  anchorEl: HTMLElement | null;
  index: number;
  category: string;
  handleAddNewColumn: (index: number) => void;
  handleDeleteColumn: (columnId: string) => void;
  handleClickOnMenu: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    columnId: string
  ) => void;
  handleCloseMenu: () => void;
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
  ...rest
}: AutocompleteInputProps & TextFieldProps) => {
  return (
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
              onClick={(
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ) => handleClickOnMenu(event, columnId)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={open && columnId === columnClickedId}
              onClose={handleCloseMenu}
              PaperProps={{
                style: {
                  width: '20ch'
                }
              }}
            >
              <Stack
                key="add-column-action"
                justifyContent="center"
                alignItems="flex-start"
                spacing={1}
                sx={{
                  padding: '0 8px'
                }}
              >
                <Stack flexDirection="row" alignItems="center" spacing={0.5}>
                  <HexagonOutlinedIcon size="16px" />

                  <MenuItem onClick={() => handleAddNewColumn(index)}>
                    Add Column
                  </MenuItem>
                </Stack>
                <Stack
                  key="delete-column-action"
                  flexDirection="row"
                  alignItems="center"
                  spacing={0.5}
                >
                  <HexagonOutlinedIcon size="16px" />

                  <MenuItem onClick={() => handleDeleteColumn(columnId)}>
                    Delete Column
                  </MenuItem>
                </Stack>
              </Stack>
            </Menu>
          </>
        )
      }}
    />
  );
};

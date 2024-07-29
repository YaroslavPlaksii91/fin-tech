import { ReactElement } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';

import MoreHorizontalIcon from '@icons/moreHorizontal.svg';

type VariableInputProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  menuItems: {
    key: string;
    onClick: () => void;
    disabled: boolean;
    icon: ReactElement;
    text: string;
  }[];
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleCloseMenu: () => void;
  showActionButton?: boolean;
};

const VariableInput = ({
  open,
  anchorEl,
  menuItems,
  onClick,
  handleCloseMenu,
  showActionButton,
  ...rest
}: VariableInputProps & OutlinedInputProps) => (
  <OutlinedInput
    {...rest}
    placeholder="Choose the variable"
    endAdornment={
      <>
        {showActionButton && (
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            size="small"
            onClick={onClick}
          >
            <MoreHorizontalIcon />
          </IconButton>
        )}
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.key}
              onClick={item.onClick}
              disabled={item.disabled}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {item.text}
            </MenuItem>
          ))}
        </Menu>
      </>
    }
  />
);

export default VariableInput;

import { ReactElement, useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';

import MoreHorizontalIcon from '@icons/moreHorizontal.svg';

type VariableInputProps = {
  menuItems: {
    key: string;
    onClick: () => void;
    disabled: boolean;
    icon: ReactElement;
    text: string;
  }[];
  onClick: () => void;
  showActionButton?: boolean;
};

const VariableInput = ({
  menuItems,
  onClick,
  showActionButton,
  ...props
}: VariableInputProps & OutlinedInputProps) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const isMenuOpen = Boolean(anchor);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick();
    setAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchor(null);
  };

  return (
    <OutlinedInput
      sx={{ padding: 0 }}
      placeholder="Choose the variable"
      inputProps={{ sx: { padding: 0, fontSize: '14px' } }}
      endAdornment={
        <>
          {showActionButton && (
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={isMenuOpen ? 'long-menu' : undefined}
              aria-expanded={isMenuOpen ? 'true' : undefined}
              aria-haspopup="true"
              size="small"
              onClick={handleClick}
              sx={{ padding: 0 }}
            >
              <MoreHorizontalIcon />
            </IconButton>
          )}
          <Menu
            id="long-menu"
            anchorEl={anchor}
            open={isMenuOpen}
            onClose={handleCloseMenu}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.key}
                onClick={() => {
                  item.onClick();
                  handleCloseMenu();
                }}
                disabled={item.disabled}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {item.text}
              </MenuItem>
            ))}
          </Menu>
        </>
      }
      {...props}
    />
  );
};

export default VariableInput;

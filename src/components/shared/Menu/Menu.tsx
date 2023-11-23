import React from 'react';
import { MenuItem, ListItemIcon } from '@mui/material';
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';

import Link from '../Link/Link';

import { StyledMenu } from './styled';

interface MenuProps {
  anchorEl: HTMLElement | null;
  handleCloseMenu: () => void;
  options: { cb?: () => void; path: string; label: string }[];
}

const Menu: React.FC<MenuProps> = ({ options, anchorEl, handleCloseMenu }) => {
  const handleClick = (cb?: () => void) => {
    cb && cb();
    handleCloseMenu();
  };
  return (
    <StyledMenu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
    >
      {options.map((option, index) => (
        <MenuItem key={index} onClick={() => handleClick(option.cb)}>
          <ListItemIcon>
            <HexagonOutlinedIcon sx={{ fontSize: ' 16px' }} />
          </ListItemIcon>
          <Link path={option.path} label={option.label} />
        </MenuItem>
      ))}
    </StyledMenu>
  );
};

export default Menu;

import React from 'react';
import { MenuItem, ListItemIcon } from '@mui/material';

import Link from '../Link/Link';
import { HexagonOutlinedIcon } from '../Icons';

import { StyledMenu } from './styled';

interface MenuProps {
  anchorEl: HTMLElement | null;
  handleCloseMenu: (key?: string) => void;
  options: { label: string; dataKey?: string; path?: string }[];
  anchorPositionTop?: boolean;
}

const Menu: React.FC<MenuProps> = ({
  options,
  anchorEl,
  handleCloseMenu,
  anchorPositionTop = false
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleCloseMenu(event.currentTarget.dataset.key);
  };

  const anchorHorizontal = anchorPositionTop ? 'center' : 'left';

  return (
    <StyledMenu
      anchorPosition={{ top: 500, left: 0 }}
      anchorOrigin={{
        vertical: anchorPositionTop ? 'top' : 'bottom',
        horizontal: anchorHorizontal
      }}
      transformOrigin={{
        vertical: anchorPositionTop ? 'bottom' : 'top',
        horizontal: anchorHorizontal
      }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => handleCloseMenu()}
    >
      {options.map((option, index) => (
        <MenuItem
          key={index}
          data-key={option?.dataKey ? option.dataKey : option.label}
          onClick={(event) => handleClick(event)}
        >
          <ListItemIcon>
            <HexagonOutlinedIcon size="16px" />
          </ListItemIcon>
          {option?.path ? (
            <Link path={option.path} label={option.label} />
          ) : (
            option.label
          )}
        </MenuItem>
      ))}
    </StyledMenu>
  );
};

export default Menu;

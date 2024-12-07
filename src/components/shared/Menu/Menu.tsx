import React, { ReactNode } from 'react';
import {
  MenuItem,
  ListItemIcon,
  MenuProps as MuiMenuProps
} from '@mui/material';

import Link from '../Link';

import { StyledMenu } from './styled';

export type Option = {
  label: string;
  dataKey?: string;
  path?: string;
  disabled?: boolean;
  icon?: ReactNode;
  textColor?: string;
  hide?: boolean;
};
interface MenuProps extends Omit<MuiMenuProps, 'open'> {
  anchorEl: HTMLElement | null;
  handleCloseMenu: (key?: string) => void;
  options: Option[];
  footer?: React.ReactNode;
}

const Menu = ({
  options,
  anchorEl,
  handleCloseMenu,
  footer,
  ...props
}: MenuProps) => {
  const handleClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    handleCloseMenu(event.currentTarget.dataset.key);
  };

  return (
    <StyledMenu
      {...props}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => handleCloseMenu()}
    >
      {options.map((option, index) =>
        !option.hide ? (
          <MenuItem
            sx={{ color: option?.textColor }}
            key={index}
            data-key={option?.dataKey ? option.dataKey : option.label}
            onClick={(event) => handleClick(event)}
            disabled={option?.disabled}
          >
            {option?.icon && <ListItemIcon>{option.icon}</ListItemIcon>}
            {option?.path ? (
              <Link path={option.path} label={option.label} />
            ) : (
              option.label
            )}
          </MenuItem>
        ) : null
      )}
      {footer}
    </StyledMenu>
  );
};

export default Menu;

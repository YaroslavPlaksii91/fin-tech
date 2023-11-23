import React, { ReactNode } from 'react';

import { StyledButton, StyledKeyboardArrowDownIcon } from './styled';

import Menu from '@components/shared/Menu/Menu';

interface Props {
  options: { label: string; path: string; onClick?: () => void }[];
  label: ReactNode;
}

const Dropdown: React.FC<Props> = ({ options, label }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledButton
        size="medium"
        endIcon={<StyledKeyboardArrowDownIcon isOpen={open} />}
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpenMenu}
        isOpen={open}
      >
        {label}
      </StyledButton>
      <Menu
        anchorEl={anchorEl}
        handleCloseMenu={handleCloseMenu}
        options={options}
      />
    </div>
  );
};

export default Dropdown;

import React from 'react';

import { StyledIconButton } from './styled';

import Menu from '@components/shared/Menu/Menu';
import { MoreVertIcon } from '@components/shared/Icons';

const options = [
  { label: 'View flow details' },
  { label: 'View data dictionary' },
  { label: 'Duplicate flow' },
  { label: 'Edit flow' },
  { label: 'Rename flow' },
  { label: 'Delete flow' }
];

const ActionsMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledIconButton aria-label="action-menu" onClick={handleOpenMenu}>
        <MoreVertIcon />
      </StyledIconButton>
      <Menu
        anchorEl={anchorEl}
        handleCloseMenu={handleCloseMenu}
        options={options}
      />
    </div>
  );
};

export default ActionsMenu;

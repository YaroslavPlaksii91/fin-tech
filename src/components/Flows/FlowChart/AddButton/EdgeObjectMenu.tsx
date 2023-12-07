import { useState } from 'react';

import { ObjectType } from '../types';

import { StyledRhombButton } from './styled';

import { AddIcon } from '@components/shared/Icons';
import Menu from '@components/shared/Menu/Menu';

interface EdgeObjectMenuProps {
  id: string;
  data: {
    onAddNodeCallback: ({ id, type }: { id: string; type: string }) => void;
  };
}

const options = [
  { label: 'Calculation', dataKey: ObjectType.CALCULATION },
  { label: 'Condition', dataKey: ObjectType.CONDITION }
];

export const EdgeObjectMenu: React.FC<EdgeObjectMenuProps> = ({ data, id }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (key?: string) => {
    if (key) {
      data &&
        data.onAddNodeCallback &&
        data.onAddNodeCallback({ id, type: key });
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledRhombButton onClick={handleOpenMenu}>
        <AddIcon sx={{ transform: 'rotate(45deg)' }} />
      </StyledRhombButton>
      <Menu
        anchorPositionTop
        anchorEl={anchorEl}
        handleCloseMenu={handleCloseMenu}
        options={options}
      />
    </div>
  );
};

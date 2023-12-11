import { useState } from 'react';

import { EdgeData, ObjectType } from '../types';

import { StyledRhombButton } from './styled';

import { AddIcon } from '@components/shared/Icons';
import Menu from '@components/shared/Menu/Menu';

interface ObjectCreationMenuProps {
  id: string;
  data?: EdgeData;
}

const options = [
  { label: 'Calculation', dataKey: ObjectType.CALCULATION },
  { label: 'Condition', dataKey: ObjectType.CONDITION },
  { label: 'Champion Chalenger', dataKey: ObjectType.CHAMPION_CHALLENGER }
];

export const ObjectCreationMenu: React.FC<ObjectCreationMenuProps> = ({
  data,
  id
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (key?: string) => {
    if (key) {
      data && data.onAdd && data.onAdd({ id, type: key as ObjectType });
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

import { useState } from 'react';

import { EdgeData, StepType } from '../types';

import { StyledRhombButton } from './styled';

import { AddIcon } from '@components/shared/Icons';
import Menu from '@components/shared/Menu/Menu';

interface StepCreationMenuProps {
  id: string;
  data?: EdgeData;
}

const options = [
  { label: 'Calculation', dataKey: StepType.CALCULATION },
  { label: 'Condition', dataKey: StepType.CALCULATION },
  { label: 'Champion Challenger', dataKey: StepType.CHAMPION_CHALLENGER }
];

export const StepCreationMenu: React.FC<StepCreationMenuProps> = ({
  data,
  id
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (key?: string) => {
    if (key) {
      data && data.onAdd && data.onAdd({ id, type: key as StepType });
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledRhombButton onClick={handleOpenMenu}>
        <AddIcon sx={{ transform: 'rotate(45deg)' }} />
      </StyledRhombButton>
      <Menu
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        anchorEl={anchorEl}
        handleCloseMenu={handleCloseMenu}
        options={options}
      />
    </div>
  );
};

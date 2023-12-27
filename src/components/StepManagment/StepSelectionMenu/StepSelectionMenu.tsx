import { useState } from 'react';

import { StepType } from '../../FlowManagment/FlowChart/types';
import { AddStep } from '../AddStep/AddStep';

import { StyledRhombButton } from './styled';

import { AddIcon } from '@components/shared/Icons';
import Menu from '@components/shared/Menu/Menu';

interface StepSelectionMenuProps {
  id: string;
}

const options = [
  { label: 'Calculation', dataKey: StepType.CALCULATION },
  { label: 'Condition', dataKey: StepType.CALCULATION },
  { label: 'Champion Challenger', dataKey: StepType.CHAMPION_CHALLENGER }
];

export const StepSelectionMenu: React.FC<StepSelectionMenuProps> = ({ id }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [addStepModalOpen, setAddStepModalOpen] = useState<boolean>(false);
  const [stepType, setStepType] = useState<StepType>();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (key?: string) => {
    if (key) {
      setAddStepModalOpen(true);
      setStepType(key as StepType);
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
      {stepType && (
        <AddStep
          edgeId={id}
          stepType={stepType}
          modalOpen={addStepModalOpen}
          setModalOpen={setAddStepModalOpen}
        />
      )}
    </div>
  );
};

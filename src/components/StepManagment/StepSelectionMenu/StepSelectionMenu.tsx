import { useState } from 'react';

import {
  EdgeData,
  FunctionalStepType
} from '../../FlowManagment/FlowChart/types';
import { AddStep } from '../StepModals/AddStep';

import { StyledRhombButton } from './styled';
import { options } from './options';

import { AddIcon } from '@components/shared/Icons';
import Menu from '@components/shared/Menu/Menu';

interface StepSelectionMenuProps {
  id: string;
  data: EdgeData;
}

export const StepSelectionMenu: React.FC<StepSelectionMenuProps> = ({
  id,
  data
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [addStepModalOpen, setAddStepModalOpen] = useState<boolean>(false);
  const [selectedStep, setSelectedStep] = useState<FunctionalStepType | null>();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (key?: string) => {
    if (key) {
      setAddStepModalOpen(true);
      setSelectedStep(key as FunctionalStepType);
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledRhombButton onClick={handleOpenMenu}>
        <AddIcon />
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
      {selectedStep && addStepModalOpen && (
        <AddStep
          edgeId={id}
          onAddNodeBetweenEdges={data.onAdd}
          stepType={selectedStep}
          setSelectedStep={setSelectedStep}
          modalOpen={addStepModalOpen}
          setModalOpen={setAddStepModalOpen}
        />
      )}
    </div>
  );
};

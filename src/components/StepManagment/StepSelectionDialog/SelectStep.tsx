import { useState } from 'react';
import { Button } from '@mui/material';

import Dialog from '@components/shared/Modals/Dialog';
import { AddIcon } from '@components/shared/Icons';

export const SelectStep: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // const [addStepModalOpen, setAddStepModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const createChampionChallenger = () => {
    handleCloseModal();
    // setAddStepModalOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        variant="contained"
        color="primary"
        endIcon={<AddIcon />}
      >
        Add new step
      </Button>
      <Dialog
        title="Add a new step"
        open={modalOpen}
        displayConfirmBtn={false}
        displayedCancelBtn={false}
      >
        <Button fullWidth onClick={createChampionChallenger}>
          Champion chalenger
        </Button>
      </Dialog>
      {/* <AddStep
        edgeId=""
        stepType=""
        modalOpen={addStepModalOpen}
        setModalOpen={setAddStepModalOpen}
      /> */}
    </>
  );
};

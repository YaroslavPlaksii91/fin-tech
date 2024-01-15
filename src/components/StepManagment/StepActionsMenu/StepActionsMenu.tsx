import Menu from '@components/shared/Menu/Menu';
import Logger from '@utils/logger';
import {
  ActionTypes,
  options
} from '@components/StepManagment/StepActionsMenu/types';
import ActionMenuButton from '@components/shared/Buttons/ActionMenuButton';

interface StepActionMenuOnNode {
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  showActionMenuButton?: boolean;
}

const StepActionMenu: React.FC<StepActionMenuOnNode> = ({
  anchorEl,
  setAnchorEl,
  showActionMenuButton = false
}) => {
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleSelectedActions = (action: ActionTypes) => {
    switch (action) {
      case ActionTypes.STEP_TEXT_VIEW:
        Logger.info('Step text view');
        break;
      case ActionTypes.EDIT_STEP:
        Logger.info('Edit step');
        break;
      case ActionTypes.RENAME_STEP:
        Logger.info('Rename step');
        break;
      case ActionTypes.DUPLICATE_STEP:
        Logger.info('Duplicate step');
        break;
      default:
    }
  };

  const handleCloseMenu = (key?: string) => {
    if (key) {
      handleSelectedActions(key as ActionTypes);
    }
    setAnchorEl(null);
  };

  return (
    <>
      {showActionMenuButton && (
        <ActionMenuButton handleOnClick={handleOpenMenu} />
      )}
      <Menu
        anchorEl={anchorEl}
        handleCloseMenu={handleCloseMenu}
        options={options}
      />
    </>
  );
};

export default StepActionMenu;

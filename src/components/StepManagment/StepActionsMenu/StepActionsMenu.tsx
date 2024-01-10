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
      case ActionTypes.OBJECT_TEXT_VIEW:
        Logger.info('Object text view');
        break;
      case ActionTypes.EDIT_OBJECT:
        Logger.info('Edit object');
        break;
      case ActionTypes.RENAME_OBJECT:
        Logger.info('Rename object');
        break;
      case ActionTypes.DUPLICATE_OBJECT:
        Logger.info('Duplicate object');
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

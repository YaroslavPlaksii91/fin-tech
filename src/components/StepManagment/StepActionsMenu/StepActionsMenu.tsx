import React from 'react';

import Menu from '@components/shared/Menu/Menu';
import Logger from '@utils/logger';
import ActionMenuButton from '@components/shared/Buttons/ActionMenuButton';

enum ActionTypes {
  OBJECT_TEXT_VIEW = 'ObjectTextView',
  EDIT_OBJECT = 'EditObject',
  RENAME_OBJECT = 'RenameObject',
  DUPLICATE_OBJECT = 'DuplicateObject'
}

const options = [
  { label: 'Object text view', dataKey: ActionTypes.OBJECT_TEXT_VIEW },
  { label: 'Edit object', dataKey: ActionTypes.EDIT_OBJECT },
  { label: 'Rename object', dataKey: ActionTypes.RENAME_OBJECT },
  { label: 'Duplicate object', dataKey: ActionTypes.DUPLICATE_OBJECT }
];

const StepActionsMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  // useEffect(() => {
  //   if (menu) {
  //     handleOpenMenu(menu);
  //   }
  // }, [menu]);

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
      <ActionMenuButton handleOnClick={handleOpenMenu} />
      <Menu
        anchorEl={anchorEl}
        handleCloseMenu={handleCloseMenu}
        options={options}
      />
    </>
  );
};

export default StepActionsMenu;

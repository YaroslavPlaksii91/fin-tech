import { MoreVertIcon } from '../Icons';

import { StyledActionMenuButton } from './styled';

const ActionMenuButton: React.FC<{
  handleOnClick: (event: React.MouseEvent<HTMLElement>) => void;
}> = ({ handleOnClick }) => (
  <StyledActionMenuButton aria-label="action-menu" onClick={handleOnClick}>
    <MoreVertIcon />
  </StyledActionMenuButton>
);

export default ActionMenuButton;

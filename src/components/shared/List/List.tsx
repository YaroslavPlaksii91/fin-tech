import { MoreVertIcon } from '../Icons';

import {
  StyledIconButton,
  StyledList,
  StyledListItem,
  StyledListItemText
} from './styled';

interface ListProps {
  items: { value: string; id: string }[];
}

const List: React.FC<ListProps> = ({ items }) => (
  <StyledList>
    {items.map(({ id, value }) => (
      <StyledListItem
        key={id}
        disableGutters
        secondaryAction={
          <StyledIconButton aria-label="action-menu">
            <MoreVertIcon />
          </StyledIconButton>
        }
      >
        <StyledListItemText>{value}</StyledListItemText>
      </StyledListItem>
    ))}
  </StyledList>
);

export default List;

import { IconButton } from '@mui/material';

import { StyledList, StyledListItem, StyledListItemText } from './styled';

import { AddCircleOutlineIcon } from '@components/shared/Icons';
import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';

export default function List({
  data,
  onItemClick
}: {
  data: DataDictionaryVariable[] | UserDefinedVariable[];
  onItemClick: (item: DataDictionaryVariable | UserDefinedVariable) => void;
}) {
  return (
    <StyledList>
      {data.map((el, index) => (
        <StyledListItem
          key={index}
          secondaryAction={
            <IconButton
              onClick={() => onItemClick(el)}
              edge="end"
              aria-label="add"
            >
              <AddCircleOutlineIcon fontSize="large" />
            </IconButton>
          }
        >
          <StyledListItemText>{el.name}</StyledListItemText>
        </StyledListItem>
      ))}
    </StyledList>
  );
}

import { IconButton } from '@mui/material';

import { StyledList, StyledListItem, StyledListItemText } from './styled';

import { AddCircleOutlineIcon } from '@components/shared/Icons';
import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';

export default function List({
  data
}: {
  data: DataDictionaryVariable[] | UserDefinedVariable[];
}) {
  return (
    <StyledList>
      {data.map((el, index) => (
        <StyledListItem
          key={index}
          secondaryAction={
            <IconButton onClick={() => 'click'} edge="end" aria-label="add">
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

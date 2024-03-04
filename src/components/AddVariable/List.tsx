import { IconButton, ListItem, ListItemText } from '@mui/material';

import { StyledList } from './styled';

import { AddCircleOutlineIcon } from '@components/shared/Icons';
import { DataDictionaryVariable } from '@domain/dataDictionary';

export default function List({ data }: { data: DataDictionaryVariable[] }) {
  return (
    <StyledList>
      {data.map((el, index) => (
        <ListItem
          key={index}
          secondaryAction={
            <IconButton onClick={() => 'click'} edge="end" aria-label="add">
              <AddCircleOutlineIcon fontSize="large" />
            </IconButton>
          }
        >
          <ListItemText primary={el.variableName} />
        </ListItem>
      ))}
    </StyledList>
  );
}

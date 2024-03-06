import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import { Divider } from '@mui/material';

import { GroupHeader, GroupItems } from './styled';

interface AutocompleteGroupProps<
  T,
  DisableClearable extends boolean | undefined = boolean | undefined,
  FreeSolo extends boolean | undefined = false
> extends AutocompleteProps<T, false, DisableClearable, FreeSolo> {}

const AutocompleteGroup = <T,>(props: AutocompleteGroupProps<T>) => (
  <Autocomplete
    renderGroup={(params) => (
      <li key={params.key}>
        <GroupHeader>{params.group}</GroupHeader>
        <Divider sx={{ margin: '0 20px 0 20px' }} />
        <GroupItems>{params.children}</GroupItems>
      </li>
    )}
    {...props}
  />
);

export default AutocompleteGroup;

import React, {
  ForwardRefRenderFunction,
  MutableRefObject,
  useImperativeHandle,
  useRef
} from 'react';
import { ListItemText, MenuItem, MenuList } from '@mui/material';

import { StyledPaper } from './styled';
import { FunctionConfig } from './types';

export interface FunctionsAutosuggestionAPI {
  focus: () => void;
}

interface FunctionsAutosuggestionProps {
  list: FunctionConfig[];
  onClick: (literal: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLUListElement>) => void;
}

const FunctionsAutosuggestion: ForwardRefRenderFunction<
  FunctionsAutosuggestionAPI,
  FunctionsAutosuggestionProps
> = (
  { list, onClick, onKeyDown },
  ref?: React.ForwardedRef<FunctionsAutosuggestionAPI>
) => {
  const firstSuggestItemRef: MutableRefObject<HTMLLIElement | null> =
    useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      focus() {
        firstSuggestItemRef.current?.focus();
      }
    }),
    [firstSuggestItemRef]
  );

  return (
    <StyledPaper variant="outlined" elevation={0}>
      <MenuList dense style={{ padding: 0 }} onKeyDown={onKeyDown}>
        {list.map((fnConf, index) => (
          <MenuItem
            ref={index === 0 ? firstSuggestItemRef : null}
            divider
            dense
            tabIndex={0}
            key={fnConf.literal}
            onClick={() => {
              onClick(fnConf.literal);
            }}
          >
            <ListItemText
              tabIndex={0}
              primary={fnConf.literal}
              secondary={fnConf.description}
              secondaryTypographyProps={{
                fontSize: 12
              }}
            />
          </MenuItem>
        ))}
      </MenuList>
    </StyledPaper>
  );
};

export default React.forwardRef<
  FunctionsAutosuggestionAPI,
  FunctionsAutosuggestionProps
>(FunctionsAutosuggestion);

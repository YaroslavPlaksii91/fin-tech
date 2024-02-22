import React, {
  ForwardRefRenderFunction,
  MutableRefObject,
  useImperativeHandle,
  useRef
} from 'react';
import { ListItemText, MenuItem, MenuList, Paper } from '@mui/material';

import styles from '@components/ExpresionEditor/ExpressionEditor.module.scss';
import { FunctionConfig } from '@components/ExpresionEditor/ExpressionEditor.constants.ts';

export interface FunctionsAutosuggestionAPI {
  focus: () => void;
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
    <Paper className={styles.suggestBox} variant="outlined" elevation={12}>
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
              primary={fnConf.literal}
              secondary={fnConf.description}
              secondaryTypographyProps={{
                fontSize: 12
              }}
            />
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  );
};

interface FunctionsAutosuggestionProps {
  list: FunctionConfig[];
  onClick: (literal: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLUListElement>) => void;
}

export default React.forwardRef<
  FunctionsAutosuggestionAPI,
  FunctionsAutosuggestionProps
>(FunctionsAutosuggestion);

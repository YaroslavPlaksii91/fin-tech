import React, {
  HTMLProps,
  MutableRefObject,
  useMemo,
  useRef,
  useState
} from 'react';
import { TextareaAutosize } from '@mui/base';
import { ListItemText, MenuItem, MenuList, Paper } from '@mui/material';

import styles from './ExpressionEditor.module.scss';

import { editorConfig } from '@components/ExpresionEditor/ExpressionEditor.config.ts';
import { ExpressionEditorCore } from '@components/ExpresionEditor/ExpressonEditor.utils.ts';

const editor = new ExpressionEditorCore(
  editorConfig.map(({ literal }) => literal)
);

const ExpressionEditor: React.FC<ExpressionEditorProps> = () => {
  const textareaRef: MutableRefObject<HTMLTextAreaElement | null> =
    useRef(null);
  const firstFunctionSuggestItemRef: MutableRefObject<HTMLLIElement | null> =
    useRef(null);

  const [value, setValue] = useState<string>('');
  const [caretPosition, setCaretPosition] = useState<number>(0);

  const currentOperator = editor.findLeftOperator(value, caretPosition);

  const functionsSuggestList = useMemo(() => {
    if (!value) {
      return [];
    }

    if (!currentOperator) {
      const lastPart = editor.extractExpressionLastPart(value);
      return editorConfig.filter(({ literal }) =>
        literal.startsWith(lastPart.toUpperCase())
      );
    }

    return [];
  }, [value, currentOperator]);

  const handleSuggestClick = (literal: string) => {
    const updatedValue = value
      ? editor.replaceLastWord(value, literal)
      : literal;

    setValue(updatedValue + '(');
    textareaRef.current?.focus();
  };

  return (
    <div className={styles.root}>
      <TextareaAutosize
        ref={textareaRef}
        value={value}
        onChange={({ target }) => {
          setValue(target.value);
        }}
        className={styles.textarea}
        minRows={1}
        maxRows={10}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            if (firstFunctionSuggestItemRef.current) {
              firstFunctionSuggestItemRef.current.focus();
            }
          }
          setCaretPosition(e.currentTarget.selectionStart);
        }}
        onClick={(e) => {
          setCaretPosition(e.currentTarget.selectionStart);
        }}
      />
      {!currentOperator && Boolean(functionsSuggestList.length) && (
        <Paper className={styles.suggestBox} variant="outlined" elevation={12}>
          <MenuList dense style={{ padding: 0 }}>
            {functionsSuggestList.map((fnConf, index) => (
              <MenuItem
                ref={index === 0 ? firstFunctionSuggestItemRef : null}
                divider
                dense
                tabIndex={0}
                key={fnConf.literal}
                onClick={() => {
                  handleSuggestClick(fnConf.literal);
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
      )}
    </div>
  );
};

interface ExpressionEditorProps extends HTMLProps<HTMLTextAreaElement> {}

export default ExpressionEditor;

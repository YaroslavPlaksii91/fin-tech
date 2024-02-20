import React, {
  HTMLProps,
  MutableRefObject,
  useMemo,
  useRef,
  useState
} from 'react';
import { TextareaAutosize } from '@mui/base';
import { ListItemText, MenuItem, MenuList, Paper } from '@mui/material';
import { keyBy } from 'lodash';
import Highlighter from 'react-highlight-words';

import styles from './ExpressionEditor.module.scss';

import { editorConfig } from '@components/ExpresionEditor/ExpressionEditor.config.ts';
import { ExpressionEditorCore } from '@components/ExpresionEditor/ExpressonEditor.utils.ts';

const editor = new ExpressionEditorCore(
  editorConfig.map(({ literal }) => literal)
);

const functionsConfigDict = keyBy(editorConfig, 'literal');

const extractArgumentsFromDomescticDescription = (description: string) => {
  const pattern = /\s*,\s*(?![^[]*\])/;
  const result = description.split(pattern);
  return result.map((value) => value.trim());
};

const ExpressionEditor: React.FC<ExpressionEditorProps> = () => {
  const textareaRef: MutableRefObject<HTMLTextAreaElement | null> =
    useRef(null);
  const firstFunctionSuggestItemRef: MutableRefObject<HTMLLIElement | null> =
    useRef(null);

  const [value, setValue] = useState<string>('');
  const [caretPosition, setCaretPosition] = useState<number>(0);

  const currentOperator = editor.findLeftOperator(value, caretPosition);
  const currentOperatorLiteral = currentOperator?.operator;
  const currentOperatorIndex: number = currentOperator?.index || 0;

  const functionsSuggestList = useMemo(() => {
    if (!value) {
      return [];
    }

    if (!currentOperatorLiteral) {
      const lastPart = editor.extractExpressionLastPart(value);
      return editorConfig.filter(({ literal }) =>
        literal.startsWith(lastPart.toUpperCase())
      );
    }

    return [];
  }, [value, currentOperatorLiteral]);

  const functionArgumentsTooltip = useMemo(() => {
    if (!currentOperatorLiteral) {
      return null;
    }

    const currentConfig = functionsConfigDict[currentOperatorLiteral];

    const domesticDescription = currentConfig.domesticDescription || '';
    const rightSideValue = value.substring(currentOperatorIndex);

    const descriptionArgs = extractArgumentsFromDomescticDescription(
      domesticDescription
        .replace(currentOperatorLiteral, '')
        .replace(/[()]/g, '')
    ).map((i) => i.trim());

    const valueArgs = rightSideValue
      .replace(currentOperatorLiteral, '')
      .replace(/[()]/g, '')
      .split(',');

    const searchWord =
      descriptionArgs[
        valueArgs.length > descriptionArgs.length
          ? descriptionArgs.length - 1
          : valueArgs.length - 1
      ];

    return (
      <Paper className={styles.suggestBox} variant="outlined" elevation={12}>
        <MenuItem disableRipple dense>
          <ListItemText>
            {currentOperatorLiteral}
            <Highlighter
              autoEscape={true}
              searchWords={[searchWord]}
              textToHighlight={domesticDescription.replace(
                currentOperatorLiteral,
                ''
              )}
            />
          </ListItemText>
        </MenuItem>
      </Paper>
    );
  }, [
    functionsConfigDict,
    currentOperatorLiteral,
    currentOperatorIndex,
    value
  ]);

  const handleSuggestClick = (literal: string) => {
    const updatedValue =
      (value ? editor.replaceLastWord(value, literal) : literal) + '(';

    setValue(updatedValue);
    setCaretPosition(updatedValue.length);
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
      {functionArgumentsTooltip}
      {!currentOperatorLiteral && Boolean(functionsSuggestList.length) && (
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

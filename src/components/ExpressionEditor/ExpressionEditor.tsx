import React, {
  ForwardRefRenderFunction,
  MutableRefObject,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Button,
  InputAdornment,
  InputBaseComponentProps,
  TextField
} from '@mui/material';

import styles from './ExpressionEditor.module.scss';

import {
  regExpHelpers,
  highlightChunks,
  filterFunctionsSuggestList
} from '@components/ExpressionEditor/ExpressionEditor.utils.ts';
import { functionsLiterals } from '@components/ExpressionEditor/ExpressionEditor.constants.ts';
import FunctionArgumentsTooltip from '@components/ExpressionEditor/components/FunctionArgumentsTooltip.tsx';
import FunctionsAutosuggestion, {
  FunctionsAutosuggestionAPI
} from '@components/ExpressionEditor/components/FunctionsAutosuggestion.tsx';

export interface ExpressionEditorAPI {
  focus: (payload: { selectionStart: number }) => void;
  getCursorPosition: () => number;
}

const ExpressionEditor: ForwardRefRenderFunction<
  ExpressionEditorAPI,
  ExpressionEditorProps
> = (
  {
    name,
    value,
    onChange,
    error,
    onAddVariableClick,
    placeholder = 'Expression'
  },
  ref
) => {
  const textareaRef: MutableRefObject<HTMLTextAreaElement | null> =
    useRef(null);

  const functionAutosuggestionRef: MutableRefObject<FunctionsAutosuggestionAPI | null> =
    useRef(null);
  const [caretPosition, setCaretPosition] = useState<number>(0);

  useImperativeHandle(
    ref,
    () => ({
      focus(payload) {
        if (payload.selectionStart) {
          setCaretPosition(payload.selectionStart);
          textareaRef.current?.setSelectionRange(
            payload.selectionStart,
            payload.selectionStart
          );
        }
        textareaRef.current?.focus();
      },
      getCursorPosition() {
        return caretPosition;
      }
    }),
    [textareaRef, setCaretPosition, caretPosition]
  );

  const currentOperator = regExpHelpers.findLeftOperator(
    value,
    caretPosition,
    functionsLiterals
  );

  const currentOperatorLiteral = currentOperator?.operator;

  const currentOperatorIndex: number = currentOperator?.index || 0;

  const functionsSuggestList = useMemo(
    () => filterFunctionsSuggestList(value, currentOperatorLiteral),
    [value, currentOperatorLiteral]
  );

  const handleSuggestClick = (literal: string) => {
    const updatedValue =
      (value ? regExpHelpers.replaceLastWord(value, literal) : literal) + '(';

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    onChange && onChange({ target: { name, value: updatedValue } });
    setCaretPosition(updatedValue.length);
    textareaRef.current?.focus();
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'ArrowDown') {
      if (functionAutosuggestionRef.current) {
        functionAutosuggestionRef.current.focus();
      }
    }

    if (e.key === 'ArrowLeft') {
      setCaretPosition((prev) => prev - 1);
      return;
    }

    setCaretPosition(e.currentTarget.selectionStart + 1);
  };

  const handleMenuListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'Escape') {
      textareaRef.current?.focus();
    }
  };

  const handleOnChange = (
    e: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    e.currentTarget.selectionStart &&
      setCaretPosition(e.currentTarget.selectionStart);
    onChange && onChange(e);
  };

  return (
    <div className={styles.root}>
      <TextField
        inputRef={textareaRef}
        value={value}
        placeholder={placeholder}
        multiline
        minRows={5}
        maxRows={10}
        error={error as boolean | undefined}
        helperText={error && error}
        inputProps={{
          onKeyDown: handleTextareaKeyDown,
          onClick: (e) => {
            setCaretPosition(e.currentTarget.selectionStart as number);
          }
        }}
        onChange={handleOnChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button size="small" variant="text" onClick={onAddVariableClick}>
                Add Input Variable
              </Button>
            </InputAdornment>
          )
        }}
      />
      <div
        className={styles.coloredValue}
        dangerouslySetInnerHTML={{ __html: highlightChunks(value) }}
      />
      <FunctionArgumentsTooltip
        value={value}
        currentOperatorIndex={currentOperatorIndex}
        currentOperatorLiteral={currentOperatorLiteral}
      />
      {!currentOperatorLiteral && Boolean(functionsSuggestList.length) && (
        <FunctionsAutosuggestion
          ref={functionAutosuggestionRef}
          list={functionsSuggestList}
          onClick={handleSuggestClick}
          onKeyDown={handleMenuListKeyDown}
        />
      )}
    </div>
  );
};

interface ExpressionEditorProps extends InputBaseComponentProps {
  name: string;
  value: string;
  error?: string;
  onAddVariableClick: () => void;
  placeholder?: string;
}

export default React.forwardRef<ExpressionEditorAPI, ExpressionEditorProps>(
  ExpressionEditor
);

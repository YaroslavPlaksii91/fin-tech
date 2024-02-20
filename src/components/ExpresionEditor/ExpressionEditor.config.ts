import { ReactNode } from 'react';
import { sortBy } from 'lodash';

enum ExpressionEditorFunction {
  SUM = 'SUM',
  MAX = 'MAX',
  SIGN = 'SIGN',
  ABS = 'ABS',
  ROUND = 'ROUND',
  TRUNC = 'TRUNC',
  INT = 'INT',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  CONTAIN = 'CONTAIN',
  LEN = 'LEN',
  SUBSTRING = 'SUBSTRING',
  DATEDIF = 'DATEDIF',
  GET_REPORT = 'GET_REPORT'
}

export interface FunctionConfig {
  literal: ExpressionEditorFunction;
  description: ReactNode;
  domesticDescription: string;
}

export const editorConfig: FunctionConfig[] = sortBy(
  [
    {
      literal: ExpressionEditorFunction.SUM,
      description: 'Takes several arguments and returns their minimum',
      domesticDescription: 'SUM(value1, [value2, …])'
    },
    {
      literal: ExpressionEditorFunction.MAX,
      description: 'Takes several arguments and returns their maximum',
      domesticDescription: 'MAX(value1, [value2, …])'
    },
    {
      literal: ExpressionEditorFunction.SIGN,
      description: 'Returns the sign for the number that is  +/-/0',
      domesticDescription: 'SIGN(value)'
    },
    {
      literal: ExpressionEditorFunction.ABS,
      description: 'Returns the absolute value of a number',
      domesticDescription: 'ABS(value)'
    },
    {
      literal: ExpressionEditorFunction.ROUND,
      description: 'Returns a number rounded to a specific number of digits',
      domesticDescription: 'ROUND(value, [places])'
    },
    {
      literal: ExpressionEditorFunction.TRUNC,
      description: 'Returns a number truncated to integer',
      domesticDescription: 'TRUNC(value, [places])'
    },
    {
      literal: ExpressionEditorFunction.INT,
      description: 'Returns the integer part of a decimal number',
      domesticDescription: 'INT(value)'
    },
    {
      literal: ExpressionEditorFunction.LEFT,
      description:
        'Takes two parameters(string, number of characters that should be taken from the left) and returns characters',
      domesticDescription: 'LEFT(string, [number_of_characters])'
    },
    {
      literal: ExpressionEditorFunction.RIGHT,
      description:
        'Takes two parameters(string, number of characters that should be taken from the right) and returns character',
      domesticDescription: 'RIGHT(string, [number_of_characters])'
    },
    {
      literal: ExpressionEditorFunction.CONTAIN,
      description: 'Check whether the string contains the given value',
      domesticDescription: 'CONTAIN(string, [search_query])'
    },
    {
      literal: ExpressionEditorFunction.LEN,
      description: 'Takes string and returns the number of characters in it',
      domesticDescription: 'LEN(text)'
    },
    {
      literal: ExpressionEditorFunction.SUBSTRING,
      description:
        'Extracts characters, between two given indices from the given string',
      domesticDescription: 'SUBSTRING(string, starting_at, extract_length)'
    },
    {
      literal: ExpressionEditorFunction.DATEDIF,
      description: 'Calculates the difference between two dates',
      domesticDescription: 'DATEDIF(start_date, end_date, unit)'
    },
    {
      literal: ExpressionEditorFunction.GET_REPORT,
      description: 'Retrieve report from the external data sources such as CRA',
      domesticDescription: 'GET_REPORT(query)'
    }
  ],
  'literal'
);

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
}

export const editorConfig: FunctionConfig[] = sortBy(
  [
    {
      literal: ExpressionEditorFunction.SUM,
      description: 'Takes several arguments and returns their minimum'
    },
    {
      literal: ExpressionEditorFunction.MAX,
      description: 'Takes several arguments and returns their maximum'
    },
    {
      literal: ExpressionEditorFunction.SIGN,
      description: 'Returns the sign for the number that is  +/-/0'
    },
    {
      literal: ExpressionEditorFunction.ABS,
      description: 'Returns the absolute value of a number'
    },
    {
      literal: ExpressionEditorFunction.ROUND,
      description: 'Returns a number rounded to a specific number of digits'
    },
    {
      literal: ExpressionEditorFunction.TRUNC,
      description: 'Returns a number truncated to integer'
    },
    {
      literal: ExpressionEditorFunction.INT,
      description: 'Returns the integer part of a decimal number'
    },
    {
      literal: ExpressionEditorFunction.LEFT,
      description:
        'Takes two parameters(string, number of characters that should be taken from the left) and returns characters'
    },
    {
      literal: ExpressionEditorFunction.RIGHT,
      description:
        'Takes two parameters(string, number of characters that should be taken from the right) and returns character'
    },
    {
      literal: ExpressionEditorFunction.CONTAIN,
      description: 'Check whether the string contains the given value'
    },
    {
      literal: ExpressionEditorFunction.LEN,
      description: 'Takes string and returns the number of characters in it'
    },
    {
      literal: ExpressionEditorFunction.SUBSTRING,
      description:
        'Extracts characters, between two given indices from the given string'
    },
    {
      literal: ExpressionEditorFunction.DATEDIF,
      description: 'Calculates the difference between two dates'
    },
    {
      literal: ExpressionEditorFunction.GET_REPORT,
      description: 'Retrieve report from the external data sources such as CRA'
    }
  ],
  'literal'
);

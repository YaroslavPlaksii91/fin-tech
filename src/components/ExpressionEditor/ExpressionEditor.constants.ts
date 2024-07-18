import { ReactNode } from 'react';
import { keyBy, sortBy } from 'lodash';

enum ExpressionOperatorCategory {
  ARITHMETIC = 'ARITHMETIC',
  LOGICAL = 'LOGICAL',
  COMPARISON = 'COMPARISON',
  INCLUSION = 'INCLUSION',
  BASIC_MATH = 'BASIC_MATH',
  BASIC_TEXT = 'BASIC_TEXT',
  MISCELANEOUS = 'MISCELANEOUS',
  EXTERNAL = 'EXTERNAL'
}

export interface FunctionConfig {
  literal: ExpressionEditorFunction;
  description: ReactNode;
  domesticDescription: string;
  category: ExpressionOperatorCategory | string;
  color?: string;
}

export interface OperatorConfig {
  literal: string;
  category: ExpressionOperatorCategory | string;
}

export enum ExpressionEditorFunction {
  MIN = 'MIN',
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

// POST MVP
enum FunctionGroupColor {
  pink = '#FCE4EC',
  orange = '#FFF3E0',
  latte = '#F9FBE7',
  mint = '#F1F8E9',
  blue = '#E1F5FE'
}

export const operatorsConfig: OperatorConfig[] = [
  {
    literal: '+',
    category: ExpressionOperatorCategory.ARITHMETIC
  },
  {
    literal: '-',
    category: ExpressionOperatorCategory.ARITHMETIC
  },
  {
    literal: '*',
    category: ExpressionOperatorCategory.ARITHMETIC
  },
  {
    literal: '/',
    category: ExpressionOperatorCategory.ARITHMETIC
  },
  {
    literal: 'AND',
    category: ExpressionOperatorCategory.LOGICAL
  },
  {
    literal: 'OR',
    category: ExpressionOperatorCategory.LOGICAL
  },
  {
    literal: 'NOT',
    category: ExpressionOperatorCategory.LOGICAL
  },
  {
    literal: 'IN',
    category: ExpressionOperatorCategory.INCLUSION
  },
  {
    literal: '=',
    category: ExpressionOperatorCategory.COMPARISON
  },
  {
    literal: '!=',
    category: ExpressionOperatorCategory.COMPARISON
  },
  {
    literal: '<',
    category: ExpressionOperatorCategory.COMPARISON
  },
  {
    literal: '>',
    category: ExpressionOperatorCategory.COMPARISON
  },
  {
    literal: '<=',
    category: ExpressionOperatorCategory.COMPARISON
  },
  {
    literal: '>=',
    category: ExpressionOperatorCategory.COMPARISON
  }
];

export const functionsConfig: FunctionConfig[] = [
  {
    literal: ExpressionEditorFunction.MIN,
    description: 'Takes several arguments and returns their minimum',
    domesticDescription: 'MIN(value1, [value2, …])',
    category: ExpressionOperatorCategory.BASIC_MATH,
    // POST MVP
    color: FunctionGroupColor.pink
  },
  {
    literal: ExpressionEditorFunction.MAX,
    description: 'Takes several arguments and returns their maximum',
    domesticDescription: 'MAX(value1, [value2, …])',
    category: ExpressionOperatorCategory.BASIC_MATH
  },
  {
    literal: ExpressionEditorFunction.SIGN,
    description: 'Returns the sign for the number that is  +/-/0',
    domesticDescription: 'SIGN(value)',
    category: ExpressionOperatorCategory.BASIC_MATH
  },
  {
    literal: ExpressionEditorFunction.ABS,
    description: 'Returns the absolute value of a number',
    domesticDescription: 'ABS(value)',
    category: ExpressionOperatorCategory.BASIC_MATH
  },
  {
    literal: ExpressionEditorFunction.ROUND,
    description: 'Returns a number rounded to a specific number of digits',
    domesticDescription: 'ROUND(value, [places])',
    category: ExpressionOperatorCategory.BASIC_MATH
  },
  {
    literal: ExpressionEditorFunction.TRUNC,
    description: 'Returns a number truncated to integer',
    domesticDescription: 'TRUNC(value, [places])',
    category: ExpressionOperatorCategory.BASIC_MATH
  },
  {
    literal: ExpressionEditorFunction.INT,
    description: 'Returns the integer part of a decimal number',
    domesticDescription: 'INT(value)',
    category: ExpressionOperatorCategory.BASIC_MATH
  },
  {
    literal: ExpressionEditorFunction.LEFT,
    description:
      'Takes two parameters(string, number of characters that should be taken from the left) and returns characters',
    domesticDescription: 'LEFT(string, [number_of_characters])',
    category: ExpressionOperatorCategory.BASIC_TEXT
  },
  {
    literal: ExpressionEditorFunction.RIGHT,
    description:
      'Takes two parameters(string, number of characters that should be taken from the right) and returns character',
    domesticDescription: 'RIGHT(string, [number_of_characters])',
    category: ExpressionOperatorCategory.BASIC_TEXT
  },
  {
    literal: ExpressionEditorFunction.CONTAIN,
    description: 'Check whether the string contains the given value',
    domesticDescription: 'CONTAIN(string, [search_query])',
    category: ExpressionOperatorCategory.BASIC_TEXT
  },
  {
    literal: ExpressionEditorFunction.LEN,
    description: 'Takes string and returns the number of characters in it',
    domesticDescription: 'LEN(text)',
    category: ExpressionOperatorCategory.BASIC_TEXT
  },
  {
    literal: ExpressionEditorFunction.SUBSTRING,
    description:
      'Extracts characters, between two given indices from the given string',
    domesticDescription: 'SUBSTRING(string, starting_at, extract_length)',
    category: ExpressionOperatorCategory.BASIC_TEXT
  },
  {
    literal: ExpressionEditorFunction.DATEDIF,
    description: 'Calculates the difference between two dates',
    domesticDescription: 'DATEDIF(start_date, end_date, unit)',
    category: ExpressionOperatorCategory.MISCELANEOUS
  },
  {
    literal: ExpressionEditorFunction.GET_REPORT,
    description: 'Retrieve report from the external data sources such as CRA',
    domesticDescription:
      'GET_REPORT(This function accepts two arguments. CRA the Enum that allows two different values: ReportType.CraFactorTrust, ReportType.CraClarity. Should you choose ReportType.CraFactorTrust you do not need to provide the second argument. Whereas if you choose ReportType.CraClarity, you must provide the second argument - the name of the control file in string format e.g.',
    category: ExpressionOperatorCategory.MISCELANEOUS
  }
];

export const sortedFunctionsConfig = sortBy(functionsConfig, 'literal');
export const functionsConfigDict = keyBy(functionsConfig, 'literal');
export const functionsLiterals: string[] = sortedFunctionsConfig.map(
  ({ literal }) => literal
);

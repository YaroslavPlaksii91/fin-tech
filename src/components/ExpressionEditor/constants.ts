import * as _ from 'lodash-es';

import {
  ExpressionEditorFunction,
  ExpressionOperatorCategory,
  FunctionConfig,
  FunctionGroupColor,
  OperatorConfig
} from './types';

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
    literal: ExpressionEditorFunction.CONTAINS,
    description: 'Check whether the string contains the given value',
    domesticDescription: 'CONTAINS(string, [search_query])',
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
    literal: ExpressionEditorFunction.DATEDIFF,
    description: 'Calculates the difference between two dates',
    domesticDescription: 'DATEDIFF(start_date, end_date, unit)',
    category: ExpressionOperatorCategory.MISCELANEOUS
  },
  {
    literal: ExpressionEditorFunction.TODAY,
    description: 'This function returns today`s date',
    domesticDescription: 'TODAY()',
    category: ExpressionOperatorCategory.MISCELANEOUS
  },
  {
    literal: ExpressionEditorFunction.GET_REPORT,
    description: 'Retrieve report from the external data sources such as CRA',
    domesticDescription:
      'GET_REPORT(This function accepts two arguments. CRA the Enum that allows two different values: ReportType.CraFactorTrust, ReportType.CraClarity. Should you choose ReportType.CraFactorTrust you do not need to provide the second argument. Whereas if you choose ReportType.CraClarity, you must provide the second argument - the name of the control file in string format e.g.',
    category: ExpressionOperatorCategory.MISCELANEOUS
  },
  {
    literal: ExpressionEditorFunction.MATCH,
    description:
      'Indicates whether the specified regular expression (second parameter) finds a match in the specified input string (first parameter)',
    domesticDescription: 'MATCH(string, pattern)',
    category: ExpressionOperatorCategory.ADVANCED
  },
  {
    literal: ExpressionEditorFunction.STRCMP,
    description:
      'Compares two string and return true if they are equal, otherwise false',
    domesticDescription: 'STRCMP(string1, string2)',
    category: ExpressionOperatorCategory.BASIC_TEXT
  },
  {
    literal: ExpressionEditorFunction.DOESNOTCONTAIN,
    description: "Check whether the string doesn't contain the given value",
    domesticDescription: 'DOESNOTCONTAIN(string, [search_query])',
    category: ExpressionOperatorCategory.BASIC_TEXT
  }
];

export const sortedFunctionsConfig = _.sortBy(functionsConfig, 'literal');
export const functionsConfigDict = _.keyBy(functionsConfig, 'literal');
export const functionsLiterals: string[] = sortedFunctionsConfig.map(
  ({ literal }) => literal
);

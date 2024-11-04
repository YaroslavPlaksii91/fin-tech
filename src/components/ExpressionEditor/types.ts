import { ReactNode } from 'react';

export enum ExpressionOperatorCategory {
  ARITHMETIC = 'ARITHMETIC',
  LOGICAL = 'LOGICAL',
  COMPARISON = 'COMPARISON',
  INCLUSION = 'INCLUSION',
  BASIC_MATH = 'BASIC_MATH',
  BASIC_TEXT = 'BASIC_TEXT',
  MISCELANEOUS = 'MISCELANEOUS',
  EXTERNAL = 'EXTERNAL',
  ADVANCED = 'ADVANCED'
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
  CONTAINS = 'CONTAINS',
  LEN = 'LEN',
  SUBSTRING = 'SUBSTRING',
  DATEDIFF = 'DATEDIFF',
  TODAY = 'TODAY',
  GET_REPORT = 'GET_REPORT',
  MATCH = 'MATCH',
  STRCMP = 'STRCMP',
  DOESNOTCONTAIN = 'DOESNOTCONTAIN'
}

// POST MVP
export enum FunctionGroupColor {
  pink = '#FCE4EC',
  orange = '#FFF3E0',
  latte = '#F9FBE7',
  mint = '#F1F8E9',
  blue = '#E1F5FE'
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

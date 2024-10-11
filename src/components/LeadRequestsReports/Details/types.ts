import { getFormattedRows } from './utils';

import { ExtractArrayElementType } from '@utils/types';

export enum COLUMN_IDS {
  api = 'api',
  time = 'time',
  result = 'result',
  scores = 'scores',
  requestResponse = 'requestResponse'
}

export type FormattedData = {
  id: null | string;
  api: null | string;
  time: null | number;
  result: null | string;
  scores: null | Record<string, number | string | boolean | null>;
  requestJson: null | string;
  responseJson: null | string;
};

export const callTypeCRA = {
  factorTrustCallHistory: 'CraFactorTrust',
  clarityCallHistory: 'CraClarity'
};

export type RowData = ExtractArrayElementType<
  ReturnType<typeof getFormattedRows>
>;

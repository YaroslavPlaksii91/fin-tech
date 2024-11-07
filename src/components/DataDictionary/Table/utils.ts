import dayjs from 'dayjs';

import {
  DataDictionaryVariable,
  VARIABLE_DATA_TYPE
} from '@domain/dataDictionary';
import { DATE_FORMAT } from '@constants/common';

export const getFormattedVariable = (variable: DataDictionaryVariable) => {
  if (variable.dataType === VARIABLE_DATA_TYPE.DateTime) {
    return {
      ...variable,
      defaultValue: dayjs(variable.defaultValue).format(DATE_FORMAT)
    };
  }

  if (
    variable.dataType === VARIABLE_DATA_TYPE.String &&
    variable.defaultValue
  ) {
    return {
      ...variable,
      defaultValue: `"${variable.defaultValue}"`
    };
  }

  return variable;
};

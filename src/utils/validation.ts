import { VARIABLE_DATA_TYPE } from '@domain/dataDictionary';

export const REGEX = {
  INTEGER: /^(0|[1-9]\d*)$/,
  DECIMAL: /^(0|[1-9]\d*)(\.\d+)$/,
  ENUM_DATA_TYPE: /^Enum:.+/,
  DOUBLE_QUOTES: /^".*"$/
};

export const isInteger = (value?: string | number | null) => {
  if (value === null || value === undefined) return false;
  return REGEX.INTEGER.test(value.toString());
};

export const isDecimal = (value?: string | number | null) => {
  if (value === null || value === undefined) return false;
  return REGEX.DECIMAL.test(value.toString());
};

export const isStringArray = (value: string) => {
  try {
    const parsedValue: unknown = JSON.parse(value);
    if (Array.isArray(parsedValue)) {
      return parsedValue.every((item) => typeof item === 'string');
    }
    return false;
  } catch {
    return false;
  }
};

export const checkDataType = (
  dataType: VARIABLE_DATA_TYPE,
  enumDataTypes: string[]
) => ({
  isWithEnum: enumDataTypes.includes(dataType),
  isBoolean: dataType === VARIABLE_DATA_TYPE.Boolean,
  isString: dataType === VARIABLE_DATA_TYPE.String,
  isInteger: dataType === VARIABLE_DATA_TYPE.Integer,
  isDecimal: dataType === VARIABLE_DATA_TYPE.Decimal,
  isStringArray: dataType === VARIABLE_DATA_TYPE.StringArray
});

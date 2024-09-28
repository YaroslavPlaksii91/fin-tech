export const REGEX = {
  INTEGER: /^(0|[1-9]\d*)$/,
  DECIMAL: /^(0|[1-9]\d*)(\.\d+)?$/
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
    const normalizedValue = value.replace(/'/g, '"');
    const parsedValue: unknown = JSON.parse(normalizedValue);
    if (Array.isArray(parsedValue)) {
      return parsedValue.every((item) => typeof item === 'string');
    }
    return false;
  } catch {
    return false;
  }
};

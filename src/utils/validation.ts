export const REGEX = {
  INTEGER: /^-?\d+$/,
  DECIMAL: /^-?\d*\.\d+$/
};

export const isInteger = (value?: string | number | null) => {
  if (value === null || value === undefined) return false;

  return REGEX.INTEGER.test(value.toString());
};

export const isDecimal = (value?: string | number | null) => {
  if (value === null || value === undefined) return false;

  return REGEX.DECIMAL.test(value.toString());
};

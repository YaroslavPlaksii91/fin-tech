import { AxiosError } from 'axios';
import { FieldErrors } from 'react-hook-form';

import { GENERAL_SERVER_ERROR } from '@constants/common';

type Errors = {
  [key: string]: string[];
};

const parseAxiosError = (error: AxiosError) => {
  if (
    error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'errors' in error.response.data
  ) {
    const { errors } = error.response.data;
    return Object.entries(errors as Errors)
      .map(([, value]) => `${value.join(', ')}`)
      .join(' ');
  } else {
    return GENERAL_SERVER_ERROR;
  }
};

const parseErrorMessages = (error: unknown) => {
  if (error instanceof AxiosError) {
    return parseAxiosError(error);
  } else {
    return GENERAL_SERVER_ERROR;
  }
};

const parseValidationError = (
  errors: FieldErrors,
  name: string
): string | undefined => {
  const error = errors[name];

  if (error) {
    if ('root' in error) {
      return error.root?.message as string;
    }

    return error.message as string;
  }

  return undefined;
};

export { parseErrorMessages, parseValidationError };

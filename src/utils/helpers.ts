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
    typeof error.response.data === 'object'
  ) {
    let res = error.response.data;
    if ('errors' in error.response.data) {
      const { errors } = error.response.data;
      res = errors;
    }

    const errorsArray = Object.entries(res as Errors).map(
      ([, value]) => `${value.toString()}`
    );

    return errorsArray;
  } else {
    return [GENERAL_SERVER_ERROR];
  }
};

const parseErrorMessages = (error: unknown) => {
  if (error instanceof AxiosError) {
    return parseAxiosError(error);
  } else {
    return [GENERAL_SERVER_ERROR];
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

    if (Array.isArray(error)) {
      return error
        .filter((err) => err)
        .map((err: FieldErrors) =>
          Object.values(err).map((err) => (err && err?.message) || '')
        )
        .toString();
    }

    return error.message as string;
  }

  return undefined;
};

export { parseErrorMessages, parseValidationError };

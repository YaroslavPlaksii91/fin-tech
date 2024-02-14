import { AxiosError } from 'axios';
import { FieldErrors } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { GENERAL_SERVER_ERROR, PRODUCTION_FLOW_ID } from '@constants/common';

type Errors = {
  [key: string]: string[];
};

const parseAxiosError = (error: AxiosError) => {
  if (
    error.response &&
    error.response.data &&
    typeof error.response.data === 'object'
  ) {
    return Object.entries(error.response.data as Errors)
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

const checkIsProductionFlow = () => {
  const { id } = useParams();
  return id === PRODUCTION_FLOW_ID;
};

export { parseErrorMessages, parseValidationError, checkIsProductionFlow };

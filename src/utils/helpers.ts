import { AxiosError } from 'axios';

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

export { parseErrorMessages };

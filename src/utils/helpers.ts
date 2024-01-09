import { AxiosError } from 'axios';

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
    return 'Something went wrong';
  }
};

const parseErrorMessages = (error: unknown) => {
  if (error instanceof AxiosError) {
    return parseAxiosError(error);
  } else {
    return 'Something went wrong';
  }
};

export { parseErrorMessages };

import React from 'react';
import { FieldErrors } from 'react-hook-form';

import { StyledErrorText } from './styled';

import { parseValidationError } from '@utils/helpers';

interface ErrorMessageProps {
  errors: FieldErrors;
  name: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errors, name }) => {
  if (!errors[name]) {
    return null;
  }

  return (
    <StyledErrorText variant="body2">
      {parseValidationError(errors, name)}
    </StyledErrorText>
  );
};

export default ErrorMessage;

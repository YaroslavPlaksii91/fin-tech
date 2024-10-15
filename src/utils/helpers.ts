import { AxiosError } from 'axios';
import { FieldErrors } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { UserInfoModel } from '@eloanwarehouse/frontend-core';

import {
  GENERAL_SERVER_ERROR,
  KEY_CODES,
  NOT_FOUND,
  PRODUCTION_FLOW_ID
} from '@constants/common';
import { MenuItem } from '@components/Sidebar/config';

type Errors = {
  [key: string]: string[];
};

const parseAxiosError = (error: AxiosError) => {
  if (error.response && error.response.status === 404) {
    return [NOT_FOUND];
  }
  if (
    error.response &&
    error.response.data &&
    typeof error.response.data === 'object'
  ) {
    let data: unknown = error.response.data;
    if ('errors' in error.response.data) {
      const { errors } = error.response.data;
      data = errors;
    }

    const errorsArray = Object.entries(data as Errors).map(
      ([, value]) => `${value.toString()}`
    );

    return errorsArray;
  } else {
    return [GENERAL_SERVER_ERROR];
  }
};

export const parseErrorMessages = (error: unknown) => {
  if (error instanceof AxiosError) {
    return parseAxiosError(error);
  } else {
    return [GENERAL_SERVER_ERROR];
  }
};

export const parseValidationError = (
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

export const checkIsProductionFlow = () => {
  const { id } = useParams();
  return id === PRODUCTION_FLOW_ID;
};

type PermissionCheckTarget = MenuItem | string;

export const hasPermission = (
  permissions: string[] | undefined,
  target?: PermissionCheckTarget
): boolean | undefined => {
  if (typeof target === 'string') {
    return permissions ? permissions.includes(target) : true;
  }

  if (!target) return true;

  if (!Array.isArray(target.permission)) {
    return permissions ? permissions.includes(target.permission) : true;
  }
  // update code if MenuItem will have two or more permissions
};

export const getFullUserName = (user: UserInfoModel | null) =>
  user ? user.userId : '';

export const downloadFile = (data: BlobPart, filename: string) => {
  const href = URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');

  link.href = href;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

type ExpressionError = { message: string; position: number };

export const parseExpressionError = (error: unknown): ExpressionError => {
  if (
    error instanceof AxiosError &&
    error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
  ) {
    return error.response.data as ExpressionError;
  } else {
    return { message: GENERAL_SERVER_ERROR, position: 0 };
  }
};

export const isDeleteKeyCodes = (key: string) =>
  key === KEY_CODES.Backspace || key === KEY_CODES.Delete;

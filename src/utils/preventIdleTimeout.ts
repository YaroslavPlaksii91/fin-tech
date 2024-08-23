import Logger from './logger';

import { authService } from '@services/auth';

export const preventIdleTimeout = async () => {
  try {
    await authService.fetchUserInfo();
  } catch (error) {
    Logger.error(error);
  }
};

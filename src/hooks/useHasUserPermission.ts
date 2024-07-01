import { selectUserInfo } from '@store/auth/auth';
import { useAppSelector } from '@store/hooks';
import { hasPermission } from '@utils/helpers';

export const useHasUserPermission = (permission: string | undefined) => {
  const user = useAppSelector(selectUserInfo);
  return hasPermission(user?.policies, permission);
};

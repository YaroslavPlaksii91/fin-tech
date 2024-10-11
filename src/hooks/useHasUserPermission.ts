import { selectUserInfo } from '@store/auth';
import { useAppSelector } from '@store/hooks';
import { hasPermission } from '@utils/helpers';

export const useHasUserPermission = (permission?: string) => {
  const user = useAppSelector(selectUserInfo);
  return hasPermission(user?.policies, permission);
};

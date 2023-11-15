import { RootState } from '@store/store';

export const isAuthorized = (state: RootState) => state.user.user.email;

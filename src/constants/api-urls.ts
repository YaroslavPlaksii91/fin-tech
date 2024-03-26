export const apiBaseUrl = `${import.meta.env.VITE_API_BASE}/api/v1`;
export const authApiBaseUrl = import.meta.env.VITE_IAM_SERVICE_URL;

export const apiUrls = {
  auth: {
    authorize: '/connect/authorize',
    token: '/connect/token',
    logout: '/connect/logout'
  },
  currentUser: '/Users/connect/userinfo',
  changeHistory: {
    list: '/change-history'
  }
};

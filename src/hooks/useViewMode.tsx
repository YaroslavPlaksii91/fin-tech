import { useLocation } from 'react-router-dom';

export const useViewMode = () => {
  const location = useLocation();

  if (location.pathname.includes('/view')) {
    return true;
  }
  return false;
};

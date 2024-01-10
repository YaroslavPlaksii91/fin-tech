import { useLocation } from 'react-router-dom';

import NavigateTo from '@components/shared/Link/NavigateTo';
import routes from '@constants/routes';

type LocationState = {
  from: string;
};

const NavigationHeader = () => {
  const location = useLocation();
  let title = 'Back to flow list';
  let to = routes.underwriting.flowList;

  if (location.state) {
    const state = location.state as LocationState;

    title =
      state.from === routes.underwriting.flowList
        ? 'Back to flow list'
        : 'Back to view mode';
    to = state.from;
  }

  return <NavigateTo to={to} title={title} />;
};

export default NavigationHeader;

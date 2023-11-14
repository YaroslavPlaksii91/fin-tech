import { useLayoutEffect, useEffect } from 'react';

import Helpers from '@utils/helpers';

const useIsomorphicLayoutEffect = Helpers.isClient()
  ? useLayoutEffect
  : useEffect;

export default useIsomorphicLayoutEffect;

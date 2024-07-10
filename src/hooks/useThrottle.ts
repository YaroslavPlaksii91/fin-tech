import { MutableRefObject, useRef } from 'react';

export function useThrottle(): ThrottleFunction {
  const throttleSeed: MutableRefObject<NodeJS.Timeout | null> = useRef(null);
  const throttleLastCallback: MutableRefObject<VoidFunction | null> =
    useRef(null);

  const throttleFunction = useRef<ThrottleFunction>((func, delay = 200) => {
    throttleLastCallback.current = func;

    if (!throttleSeed.current) {
      func();
      throttleSeed.current = setTimeout(() => {
        if (throttleLastCallback.current) {
          throttleLastCallback.current();
        }

        throttleSeed.current = null;
      }, delay);
    }
  });

  return throttleFunction.current;
}

type ThrottleFunction = (func: () => void, delay?: number) => void;

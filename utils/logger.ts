import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const { nodeEnv } = publicRuntimeConfig;

const isDevelopmentEnvironment = nodeEnv === 'development';

type LogLevel = 'log' | 'info' | 'warn' | 'error';

interface LoggerFunctions {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

/* eslint-disable no-console */
const LoggerRaw: LoggerFunctions = {
  log(...args) {
    console.log(...args);
  },
  info(...args) {
    console.info(...args);
  },
  warn(...args) {
    console.warn(...args);
  },
  error(...args) {
    console.error(...args);
  }
};
/* eslint-enable no-console */

const Logger = new Proxy(LoggerRaw, {
  get: function <T extends LogLevel>(target: LoggerFunctions, name: T) {
    if (!isDevelopmentEnvironment) {
      return () => void 0;
    }
    return target[name];
  }
});

export default Logger;

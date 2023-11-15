/* eslint-disable no-console*/
const Logger = {
  log(...args: unknown[]) {
    console.log(...args);
  },
  info(...args: unknown[]) {
    console.info(...args);
  },
  warn(...args: unknown[]) {
    console.warn(...args);
  },
  error(...args: unknown[]) {
    console.error(...args);
  }
};
/*eslint-enable no-console*/

export default Logger;

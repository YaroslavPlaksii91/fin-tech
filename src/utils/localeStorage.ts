import Logger from './logger';

const getStoredState = <T>(key: string, defaultValue: T) => {
  try {
    const savedState = localStorage.getItem(key);
    return savedState ? (JSON.parse(savedState) as T) : defaultValue;
  } catch (error) {
    Logger.error(`Error retrieving from localStorage for key: ${key}`, error);
    return defaultValue;
  }
};

const setStoredState = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    Logger.error(`Error setting in localStorage for key: ${key}`, error);
  }
};

const clearStoredState = (keys: string[]) => {
  try {
    keys.forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    Logger.error('Error clearing localStorage:', error);
  }
};

export { getStoredState, setStoredState, clearStoredState };

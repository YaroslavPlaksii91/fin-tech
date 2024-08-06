import { Dayjs } from 'dayjs';

export const getDateInUTC = (date: Dayjs) =>
  date.add(date.utcOffset(), 'minute');

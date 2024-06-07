import { Dayjs } from 'dayjs';

export const combineDateAndTime = (date: Dayjs | null, time: Dayjs | null) => {
  if (!time && date) return date;

  if (date && time)
    return date.set('hour', time.hour() || 0).set('minute', time.minute() || 0);

  return null;
};

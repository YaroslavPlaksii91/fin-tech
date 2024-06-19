import { Control, Controller } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers-pro';

import { IFormState } from './types';

import CalendarIcon from '@icons/calendar.svg';

interface DateFiltersProps {
  control: Control<IFormState>;
}

const DateFilters = ({ control }: DateFiltersProps) => (
  <>
    <Controller
      control={control}
      name="dateFilters.dateFrom"
      render={({ field: { value, onChange } }) => (
        <DateTimePicker
          sx={{ width: '100%' }}
          label="Date From"
          value={value}
          slots={{ openPickerIcon: CalendarIcon }}
          slotProps={{
            textField: { size: 'small' },
            openPickerIcon: { color: 'black' },
            actionBar: { actions: ['cancel', 'accept'] }
          }}
          onChange={onChange}
        />
      )}
    />
    <Controller
      control={control}
      name="dateFilters.dateTo"
      render={({ field: { value, onChange } }) => (
        <DateTimePicker
          sx={{ width: '100%' }}
          label="Date To"
          value={value}
          slots={{ openPickerIcon: CalendarIcon }}
          slotProps={{
            textField: { size: 'small' },
            openPickerIcon: { color: 'black' },
            actionBar: { actions: ['cancel', 'accept'] }
          }}
          onChange={onChange}
        />
      )}
    />
  </>
);

export default DateFilters;

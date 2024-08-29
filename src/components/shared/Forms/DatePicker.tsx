import { Dayjs } from 'dayjs';
import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController
} from 'react-hook-form';
import {
  DateTimePicker as MuiDateTimePicker,
  DatePicker as MuiDatePicker,
  DateTimePickerProps as MuiDateTimePickerProps,
  DatePickerProps as MuiDatePickerProps
} from '@mui/x-date-pickers-pro';
import { FormControl, FormControlProps } from '@mui/material';

import { StyledError } from './styled';

import CalendarIcon from '@icons/calendar.svg';

interface DatePickerProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  hasTimePicker?: boolean;
  label?: string;
}

const DatePicker = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  hasTimePicker = false,
  name,
  control,
  label,
  ...props
}: DatePickerProps<TFieldValues, TName> &
  MuiDatePickerProps<Dayjs> &
  MuiDateTimePickerProps<Dayjs> &
  FormControlProps) => {
  const Picker = hasTimePicker ? MuiDateTimePicker : MuiDatePicker;

  const { field, fieldState } = useController({ control, name });

  return (
    <FormControl error={!!fieldState?.error} {...props}>
      <Picker
        label={label}
        slots={{ openPickerIcon: CalendarIcon }}
        slotProps={{
          textField: { size: 'small' },
          openPickerIcon: { color: 'black' },
          actionBar: { actions: ['cancel', 'accept'] }
        }}
        {...field}
      />
      {fieldState?.error && (
        <StyledError variant="caption">{fieldState.error.message}</StyledError>
      )}
    </FormControl>
  );
};

export default DatePicker;

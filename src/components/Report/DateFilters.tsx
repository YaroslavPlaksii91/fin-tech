import { Dayjs } from 'dayjs';
import { Button, InputAdornment } from '@mui/material';
import {
  DateRange,
  DateRangePicker,
  DateRangeValidationError,
  PickerChangeHandlerContext,
  PickersShortcutsItem,
  TimeRangeValidationError
} from '@mui/x-date-pickers-pro';
import {
  SingleInputDateRangeField,
  SingleInputTimeRangeField
} from '@mui/x-date-pickers-pro';
import { CalendarMonth, Schedule } from '@mui/icons-material';

interface DateFiltersProps {
  isApplyDisabled?: boolean;
  date: DateRange<Dayjs>;
  time: DateRange<Dayjs>;
  shortcutsDateItems: PickersShortcutsItem<DateRange<Dayjs>>[];
  onDateChange: (
    value: DateRange<Dayjs>,
    context: PickerChangeHandlerContext<DateRangeValidationError>
  ) => void;
  onTimeChange: (
    value: DateRange<Dayjs>,
    context: PickerChangeHandlerContext<TimeRangeValidationError>
  ) => void;
  onClear: () => void;
  onApply: () => void;
}

const DateFilters = ({
  isApplyDisabled = false,
  date,
  time,
  shortcutsDateItems,
  onDateChange,
  onTimeChange,
  onClear,
  onApply
}: DateFiltersProps) => (
  <>
    <DateRangePicker
      desktopModeMediaQuery="@media (min-width: 1024px)"
      sx={{ width: 270 }}
      closeOnSelect={false}
      format="D MMM YYYY"
      label="Select period:"
      value={date}
      onChange={onDateChange}
      slots={{ field: SingleInputDateRangeField }}
      slotProps={{
        textField: {
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">
                <CalendarMonth />
              </InputAdornment>
            )
          }
        },
        actionBar: { actions: ['accept'] },
        shortcuts: { items: shortcutsDateItems }
      }}
    />
    <SingleInputTimeRangeField
      ampm
      label="Select Time"
      value={time}
      onChange={onTimeChange}
      slotProps={{
        textField: {
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">
                <Schedule />
              </InputAdornment>
            )
          }
        }
      }}
    />
    <Button size="large" color="inherit" variant="outlined" onClick={onClear}>
      Clear
    </Button>
    <Button
      size="large"
      color="success"
      variant="contained"
      disabled={isApplyDisabled}
      onClick={onApply}
    >
      Apply
    </Button>
  </>
);

export default DateFilters;

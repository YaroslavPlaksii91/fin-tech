import { Dayjs } from 'dayjs';

export type InputFiltersType = Record<string, string>;

export interface IDateFilters {
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
}

export interface IFormState {
  dateFilters?: IDateFilters;
  inputFilters?: InputFiltersType;
}

export interface IInputGroup {
  placeholder: string;
  field: string;
  label: string;
}

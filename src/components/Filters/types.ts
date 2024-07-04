import { Dayjs } from 'dayjs';

export type FiltersType = Record<string, string[]>;

export type InputFiltersType = Record<string, string>;

export interface IDateFilters {
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
}

export interface IFormState {
  filters?: FiltersType;
  dateFilters?: IDateFilters;
  inputFilters?: InputFiltersType;
}

export interface IFilterGroup {
  filterBy: keyof FiltersType;
  title: string;
  fields: string[];
  fieldsFormatting?: { key: string; value: string }[];
  applyFor: string[];
}

export interface IInputGroup {
  placeholder: string;
  field: string;
}

import { Dayjs } from 'dayjs';

export interface IFilters {
  [key: string]: string[];
}

export type Search = string;

export interface IDateFilters {
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
}

export interface IFormState {
  filters?: IFilters;
  dateFilters?: IDateFilters;
  search?: Search;
}

export interface IFilterGroups {
  filterBy: keyof IFilters;
  title: string;
  fields: string[];
  fieldsFormatting?: { key: string; value: string }[];
  applyFor: string[];
}

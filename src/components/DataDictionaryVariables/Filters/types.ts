import {
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE_WITH_ENUM_PREFIX,
  DEFAULT_VALUE
} from '@domain/dataDictionary';

export interface IFilters {
  dataType: string[];
}

export interface IFiltersGroup {
  filterBy: keyof IFilters;
  title: string;
  fields: (
    | DATA_TYPE_WITHOUT_ENUM
    | DATA_TYPE_WITH_ENUM_PREFIX
    | DEFAULT_VALUE
  )[];
}
[];

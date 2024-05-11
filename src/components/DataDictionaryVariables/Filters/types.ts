import {
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE_WITH_ENUM_PREFIX,
  INTEGRATION_VARIABLE_SOURCE_TYPE
} from '@domain/dataDictionary';

export interface IFilters {
  dataType: string[];
  source: string[];
  sourceType: string[];
}

export interface IFiltersGroup {
  filterBy: keyof IFilters;
  title: string;
  fields: (
    | DATA_TYPE_WITHOUT_ENUM
    | DATA_TYPE_WITH_ENUM_PREFIX
    | INTEGRATION_VARIABLE_SOURCE_TYPE
  )[];
}
[];

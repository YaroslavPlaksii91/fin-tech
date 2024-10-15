import { Dayjs } from 'dayjs';

import { typeSafeObjectEntries } from './object';

export type RangeFilter = { from?: string; to?: string };
export type MultiSelectionFilter = string[];
export type SearchFilter = string;
export type DateFilter = { from: Dayjs | null; to: Dayjs | null };

export type FilterValue = RangeFilter | SearchFilter | MultiSelectionFilter;

// We use this safe check to help TypeScript recognize value type for range
const checkIsRangeFilter = (value: FilterValue): value is RangeFilter =>
  (value as RangeFilter).from !== undefined ||
  (value as RangeFilter).to !== undefined;

/**
 * Builds a dynamic LINQ filter query string based on provided filters.
 *
 * @template T - The type of filters. Can be a record where each key is associated with `RangeFilter`, `MultiSelectionFilter` or `SearchFilter`.
 *
 * @param {T} filters An object containing filters, where keys are filter fields and values are filter criteria.
 * @param {Record<keyof T, string>} [map] Optional mapping object to map filter keys to "keys with full paths to filter key".
 * @returns {string} A LINQ query string with filter conditions.
 *
 */
export const buildDynamicLINQFilterQuery = <
  T extends Record<string, FilterValue>
>(
  filters: T,
  map?: Record<keyof T, string>
) =>
  typeSafeObjectEntries(filters).reduce((acc, [key, value]) => {
    let query: string | undefined;
    const isRange = checkIsRangeFilter(value);
    const isMultiSelection = Array.isArray(value);
    const isSearch = typeof value === 'string';
    const currentKey = map ? map[key] : key;

    if (
      (isRange && !value.from && !value.to) ||
      (isMultiSelection && value.length === 0) ||
      (isSearch && value.length === 0)
    )
      return acc;

    if (isRange) {
      const fromQuery = `${String(currentKey)} >= "${value.from}"`;
      const toQuery = `${String(currentKey)} <= "${value.to}"`;

      switch (true) {
        case Boolean(value.to && value.from):
          query = `${fromQuery} and ${toQuery}`;
          break;
        case Boolean(value.from):
          query = fromQuery;
          break;
        case Boolean(value.to):
          query = toQuery;
          break;
        default:
          break;
      }
    }

    if (isMultiSelection)
      query = `${String(currentKey)} in (${value.map((el) => `"${el}"`).join(', ')})`;

    // Search is case insensitive because we call ToLower() function here
    if (isSearch)
      query = `${String(currentKey)}.ToString().ToLower().Contains("${value}".ToLower())`;

    if (!acc.length) return query || acc;

    return query ? `${acc} && ${query}` : acc;
  }, '');

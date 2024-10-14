// import buildQuery from 'odata-query';

import { COLUMN_IDS, IFilters } from './types';

// import { removeSingleQuotesODataParams } from '@utils/helpers';
import { DenialReasonsReport } from '@domain/denielReasonsReports';
import { getDateInUTC } from '@utils/date';
import { buildDynamicLINQFilterQuery } from '@utils/filters';

export const getFormattedRows = (data: DenialReasonsReport[]) =>
  data.map((row, index) => {
    const { denialReason, deniedBy, totalCount, percentage } = row;

    return {
      id: index,
      data: row,
      [COLUMN_IDS.denialReason]: denialReason ?? '-',
      [COLUMN_IDS.deniedBy]: deniedBy ?? '-',
      [COLUMN_IDS.totalCount]: totalCount ?? '-',
      [COLUMN_IDS.percentage]: percentage ?? '-'
    };
  });

// export const buildOdataParams = ({
//   sort,
//   filters: {
//     leadCampaign,
//     state,
//     stack,
//     deniedBy,
//     denialReason,
//     leadPrice,
//     requestDate
//   }
// }: {
//   sort: string;
//   filters: IFilters;
// }): string => {
//   const filterConditions = [];

//   // contains condition for fields
//   const containsFields = { rejectionReason: denialReason };

//   Object.entries(containsFields).forEach(([key, value]) => {
//     if (value) {
//       filterConditions.push({
//         [key]: { contains: value }
//       });
//     }
//   });

//   if (leadPrice.from) {
//     filterConditions.push(`leadPrice ge ${leadPrice.from}`);
//   }

//   if (leadPrice.to) {
//     filterConditions.push(`leadPrice le ${leadPrice.to}`);
//   }

//   // exactMatchFields with or
//   const multiSearchFields = {
//     leadCampaign,
//     state,
//     stack,
//     deniedBy
//   };

//   Object.entries(multiSearchFields).forEach(([key, data]) => {
//     if (data?.length) {
//       const conditions = data.map((item) => `${key} eq '${item}'`).join(' or ');

//       filterConditions.push(`(${conditions})`);
//     }
//   });

//   const queries = {
//     orderBy: sort,
//     filter: {
//       date: {
//         ge: requestDate.from
//           ? getDateInUTC(requestDate.from).toISOString()
//           : undefined,
//         le: requestDate.to
//           ? getDateInUTC(requestDate.to).toISOString()
//           : undefined
//       },
//       ...(filterConditions.length && { and: filterConditions })
//     }
//   };

//   // We need to replace default odata $filter with entityFilter, is a BE request
//   const params = buildQuery(queries).replace('$filter', 'entityFilter');

//   return removeSingleQuotesODataParams(params);
// };

export const buildParams = ({
  sort,
  filters
}: {
  sort: string;
  filters: IFilters;
}) => {
  const date = {
    from: filters.date.from
      ? getDateInUTC(filters.date.from).toISOString()
      : undefined,
    to: filters.date.to
      ? getDateInUTC(filters.date.to).toISOString()
      : undefined
  };

  return {
    sort,
    filter: buildDynamicLINQFilterQuery({ ...filters, date })
  };
};

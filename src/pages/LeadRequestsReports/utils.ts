import dayjs from 'dayjs';
import buildQuery from 'odata-query';

import { COLUMN_IDS, IFilters, OdataQueries } from './types';

import { LeadRequestsReport } from '@domain/leadRequestsReports';
import { FULL_DATE_TIME_FORMAT } from '@constants/common';
import { removeSingleQuotesODataParams } from '@utils/helpers';
import { getDateInUTC } from '@utils/date';

export const getFormattedRows = (data: LeadRequestsReport[]) => {
  const milliseconds = 1000;

  return data.map((row) => {
    const { leadRequest, leadResponse, output, processingMetadata, id } = row;

    return {
      id,
      data: row,
      [COLUMN_IDS.origin]: leadRequest.origin ?? '-',
      [COLUMN_IDS.requestId]: leadRequest.requestId ?? '-',
      [COLUMN_IDS.loanId]: leadResponse?.loanId ?? '-',
      [COLUMN_IDS.leadProvider]: leadRequest.leadProviderId ?? '-',
      [COLUMN_IDS.leadCampaign]: leadRequest.campaignId ?? '-',
      [COLUMN_IDS.customerId]: leadResponse?.customerId ?? '-',
      [COLUMN_IDS.leadPrice]: leadResponse?.leadPrice ?? '-',
      [COLUMN_IDS.affiliate]: leadRequest.affiliateId ?? '-',
      [COLUMN_IDS.requestDate]: processingMetadata?.executionEndDateTimeUtc
        ? dayjs(processingMetadata.executionEndDateTimeUtc).format(
            FULL_DATE_TIME_FORMAT
          )
        : '-',
      [COLUMN_IDS.requestedAmount]: leadRequest.requestedAmount
        ? `$${leadRequest.requestedAmount}`
        : '-',
      [COLUMN_IDS.stackName]: output?.stack ?? '-',
      [COLUMN_IDS.loanType]: leadRequest.customFields.requestType ?? '-',
      [COLUMN_IDS.promoCode]: leadRequest.customFields?.promoCode ?? '-',
      [COLUMN_IDS.store]: output?.store ?? '-',
      [COLUMN_IDS.ssn]: leadRequest.ssn ?? '-',
      [COLUMN_IDS.email]: leadRequest.email,
      [COLUMN_IDS.decision]: leadResponse.result ?? '-',
      [COLUMN_IDS.denialReason]: output?.denialReason ?? '-',
      [COLUMN_IDS.state]: leadRequest.state ?? '-',
      [COLUMN_IDS.apiVersion]: processingMetadata?.apiVersion ?? '-',
      [COLUMN_IDS.totalTime]: processingMetadata?.executionTimeSpan
        ? `${processingMetadata.executionTimeSpan / milliseconds}`
        : '-',
      [COLUMN_IDS.cachedConnector]: processingMetadata?.cachedConnector ?? '-'
    };
  });
};

export const buildOdataParams = ({
  page,
  sort,
  rowsPerPage,
  filters: {
    requestId,
    affiliate,
    ssn,
    email,
    denialReason,
    cachedConnector,
    apiVersion,
    loanId,
    customerId,
    requestDate,
    leadPrice,
    requestedAmount,
    leadProvider,
    leadCampaign,
    stackName,
    loanType,
    promoCode,
    store,
    decision,
    state
  },
  includePagination = true
}: {
  page: number;
  sort: string;
  rowsPerPage: number;
  filters: IFilters;
  includePagination?: boolean;
}): string => {
  const filterConditions = [];

  // contains condition for fields
  const containsFields = {
    [COLUMN_IDS.requestId]: requestId,
    [COLUMN_IDS.affiliate]: affiliate,
    [COLUMN_IDS.ssn]: ssn,
    [COLUMN_IDS.email]: email,
    [COLUMN_IDS.denialReason]: denialReason,
    [COLUMN_IDS.cachedConnector]: cachedConnector,
    [COLUMN_IDS.apiVersion]: apiVersion
  };

  Object.entries(containsFields).forEach(([key, value]) => {
    if (value) {
      filterConditions.push({
        [key]: { contains: value }
      });
    }
  });

  // exact match for fields (temporarily) as loadId and customer Id are number value. Contains do not work on BE side
  const exactMatchFields = {
    [COLUMN_IDS.loanId]: loanId,
    [COLUMN_IDS.customerId]: customerId
  };

  Object.entries(exactMatchFields).forEach(([key, value]) => {
    if (value) {
      filterConditions.push(`${key} eq ${value}`);
    }
  });

  if (leadPrice.from) {
    filterConditions.push(`${COLUMN_IDS.leadPrice} ge ${leadPrice.from}`);
  }

  if (leadPrice.to) {
    filterConditions.push(`${COLUMN_IDS.leadPrice} le ${leadPrice.to}`);
  }

  if (requestedAmount.from) {
    filterConditions.push(
      `${COLUMN_IDS.requestedAmount} ge ${requestedAmount.from}`
    );
  }

  if (requestedAmount.to) {
    filterConditions.push(
      `${COLUMN_IDS.requestedAmount} le ${requestedAmount.to}`
    );
  }

  // exactMatchFields with or
  const multiSearchFields = {
    [COLUMN_IDS.leadProvider]: leadProvider,
    [COLUMN_IDS.leadCampaign]: leadCampaign,
    [COLUMN_IDS.stackName]: stackName,
    [COLUMN_IDS.loanType]: loanType,
    [COLUMN_IDS.promoCode]: promoCode,
    [COLUMN_IDS.store]: store,
    [COLUMN_IDS.decision]: decision,
    [COLUMN_IDS.state]: state
  };

  Object.entries(multiSearchFields).forEach(([key, data]) => {
    if (data?.length) {
      const conditions = data.map((item) => `${key} eq '${item}'`).join(' or ');

      filterConditions.push(`(${conditions})`);
    }
  });

  const queries: OdataQueries = {
    orderBy: sort,
    filter: {
      processingMetadata: {
        executionEndDateTimeUtc: {
          ge: requestDate.from
            ? getDateInUTC(requestDate.from).toISOString()
            : undefined,
          le: requestDate.to
            ? getDateInUTC(requestDate.to).toISOString()
            : undefined
        }
      },
      ...(filterConditions.length && { and: filterConditions })
    }
  };

  if (includePagination) {
    queries.top = rowsPerPage;
    queries.skip = rowsPerPage * page;
    queries.count = true;
  }

  const params = buildQuery(queries);
  return removeSingleQuotesODataParams(params);
};

// TODO improve fieldPaths usage
// const selectedKeys = [COLUMN_IDS.leadProvider];
// export const fieldPaths: FIELD_PATHS = Object.entries(COLUMN_IDS)
//   .filter(([key]) => selectedKeys.includes(COLUMN_IDS[key]))
//   .reduce(
//     (acc, [key, value]) => ({ ...acc, [key]: convertToPascalCase(value) }),
//     {} as FIELD_PATHS
//   );

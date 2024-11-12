import dayjs from 'dayjs';

import { COLUMN_IDS, COLUMN_IDS_NULLABLE_ENUM_KEYS, IFilters } from './types';

import { LeadRequestReport } from '@domain/leadRequestsReports';
import { FULL_DATE_TIME_FORMAT } from '@constants/common';
import { getDateInUTC } from '@utils/date';
import { buildDynamicLINQFilterQuery } from '@utils/filters';

export const getFormattedRows = (data: LeadRequestReport[]) => {
  const milliseconds = 1000;

  return data.map((row) => {
    const { leadRequest, leadResponse, output, processingMetadata, id } = row;

    return {
      id,
      data: row,
      [COLUMN_IDS.fullName]:
        leadRequest.firstName || leadRequest.lastName
          ? `${leadRequest.firstName ?? ''} ${leadRequest.lastName ?? ''}`.trim()
          : '-',
      [COLUMN_IDS.ssn]: leadRequest.ssn ?? '-',
      [COLUMN_IDS.email]: leadRequest.email ?? '-',
      [COLUMN_IDS.phoneNumber]: leadRequest.mobilePhone ?? '-',
      [COLUMN_IDS.origin]: leadRequest.origin ?? '-',
      [COLUMN_IDS.craScore]: processingMetadata?.craScore ?? '-',
      [COLUMN_IDS.requestId]: leadRequest.requestId ?? '-',
      [COLUMN_IDS.loanId]: leadResponse?.loanId ?? '-',
      [COLUMN_IDS.leadProvider]: leadRequest.leadProviderId ?? '-',
      [COLUMN_IDS.leadCampaign]: leadRequest.campaignId ?? '-',
      [COLUMN_IDS.customerId]: leadResponse?.customerId ?? '-',
      [COLUMN_IDS.leadPrice]: leadRequest?.leadPrice ?? '-',
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
      [COLUMN_IDS.decision]: leadResponse.result ?? '-',
      [COLUMN_IDS.deniedBy]: leadResponse?.denied_by ?? '-',
      [COLUMN_IDS.denialReason]: leadResponse?.rejection_reason ?? '-',
      [COLUMN_IDS.state]: leadRequest.state ?? '-',
      [COLUMN_IDS.apiVersion]: processingMetadata?.apiVersion ?? '-',
      [COLUMN_IDS.totalTime]: processingMetadata?.executionTimeSpan
        ? `${processingMetadata.executionTimeSpan / milliseconds}`
        : '-',
      [COLUMN_IDS.cachedConnector]: processingMetadata?.cachedConnector ?? '-'
    };
  });
};

export const buildParams = ({
  sort,
  filters,
  rowsPerPage,
  page
}: {
  sort: string;
  filters: IFilters;
  rowsPerPage?: number;
  page?: number;
}) => {
  const requestDate = {
    from: filters.requestDate.from
      ? getDateInUTC(filters.requestDate.from).toISOString()
      : undefined,
    to: filters.requestDate.to
      ? getDateInUTC(filters.requestDate.to).toISOString()
      : undefined
  };

  return {
    sort,
    pageSize: rowsPerPage,
    pageNumber: page,
    filter: buildDynamicLINQFilterQuery(
      { ...filters, requestDate },
      { ...COLUMN_IDS, ...COLUMN_IDS_NULLABLE_ENUM_KEYS }
    )
  };
};

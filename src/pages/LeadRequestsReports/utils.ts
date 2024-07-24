import dayjs from 'dayjs';

import { COLUMN_IDS } from './types';

import { LeadRequestsReport } from '@domain/leadRequestsReports';
import { FULL_DATE_TIME_FORMAT } from '@constants/common';

export const getFormattedRows = (data: LeadRequestsReport[]) => {
  const milliseconds = 1000;

  return data.map((row) => {
    const { leadRequest, leadResponse, output, processingMetadata, id } = row;

    return {
      id,
      data: row,
      [COLUMN_IDS.requestId]: leadRequest.requestId ?? '-',
      [COLUMN_IDS.loanId]: leadResponse?.loanId ?? '-',
      [COLUMN_IDS.leadProvider]: leadRequest.leadProviderId ?? '-',
      [COLUMN_IDS.leadCampaign]: leadRequest.campaignId ?? '-',
      [COLUMN_IDS.customerId]: leadResponse?.customerId ?? '-',
      [COLUMN_IDS.leadPrice]: leadResponse?.leadPrice ?? '-',
      [COLUMN_IDS.affiliate]: leadRequest.affiliateId ?? '-',
      [COLUMN_IDS.requestDate]: processingMetadata?.processingDateTimeUtc
        ? dayjs(processingMetadata.processingDateTimeUtc).format(
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
      [COLUMN_IDS.decision]: output?.decision ?? '-',
      [COLUMN_IDS.denialReason]: output?.denialReason ?? '-',
      [COLUMN_IDS.state]: leadRequest.state ?? '-',
      [COLUMN_IDS.apiVersion]: processingMetadata?.apiVersion ?? '-',
      [COLUMN_IDS.totalTime]: processingMetadata?.processingTime
        ? `${processingMetadata.processingTime / milliseconds}`
        : '-',
      [COLUMN_IDS.cachedConnector]: processingMetadata?.cachedConnector ?? '-'
    };
  });
};

export const removeSingleQuotesODataParams = (odataParams: string) =>
  odataParams.replace(/'(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)'/g, '$1');

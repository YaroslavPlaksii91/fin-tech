import dayjs from 'dayjs';

import { COLUMN_IDS } from './types';

import { LeadRequestsReports } from '@domain/leadRequestsReports';
import { FULL_DATE_TIME_FORMAT } from '@constants/common';

export const getFormattedRows = (data: LeadRequestsReports[]) => {
  const milliseconds = 1000;

  return data.map(
    ({ leadRequest, leadResponse, output, processingMetadata, id }) => ({
      id,
      [COLUMN_IDS.requestId]: leadRequest.requestId,
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
      [COLUMN_IDS.promoCode]: leadRequest.customFields?.promoCode ?? '-',
      [COLUMN_IDS.store]: output?.store ?? '-',
      [COLUMN_IDS.ssn]: leadRequest.ssn,
      [COLUMN_IDS.email]: leadRequest.email,
      [COLUMN_IDS.decision]: output?.decision ?? '-',
      [COLUMN_IDS.denialReason]: output?.denialReason ?? '-',
      [COLUMN_IDS.state]: leadRequest.state,
      [COLUMN_IDS.apiVersion]: processingMetadata?.apiVersion ?? '-',
      [COLUMN_IDS.totalTime]: processingMetadata?.processingTime
        ? `${processingMetadata.processingTime / milliseconds}`
        : '-',
      [COLUMN_IDS.cachedConnector]: processingMetadata?.cachedConnector ?? '-'
    })
  );
};

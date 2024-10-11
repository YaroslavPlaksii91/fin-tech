import { callTypeCRA, COLUMN_IDS, FormattedData } from './types';

import {
  ExternalCallItem,
  LeadRequestReport
} from '@domain/leadRequestsReports';

export const getFormattedRows = (data: FormattedData[]) =>
  data.map((row) => {
    const { id } = row;

    return {
      id,
      data: row,
      [COLUMN_IDS.api]: row.api ?? '-',
      [COLUMN_IDS.time]: row.time ?? '-',
      [COLUMN_IDS.result]: row.result ?? '-',
      [COLUMN_IDS.scores]: row.scores,
      [COLUMN_IDS.requestResponse]: {
        requestJson: row.requestJson,
        responseJson: row.responseJson
      }
    };
  });

export const getFormattedData = (data: LeadRequestReport) => {
  const leadRequest = {
    id: data.id,
    api: 'Input',
    time: data.processingMetadata?.executionTimeSpan
      ? data.processingMetadata.executionTimeSpan / 1000
      : null,
    result: data.output?.decision || null,
    scores: null,
    requestJson: data.leadRequest ? JSON.stringify(data.leadRequest) : null,
    responseJson: data.leadResponse
      ? JSON.stringify({
          ...data.leadResponse,
          result: data.output?.decision || null
        })
      : null
  };

  const externalCalls: ExternalCallItem[] = [];

  if (data.executionHistory?.externalCalls?.lmsCallHistory.length) {
    externalCalls.push(...data.executionHistory.externalCalls.lmsCallHistory);
  }

  if (data.executionHistory?.externalCalls?.clarityCallHistory) {
    externalCalls.push({
      ...data.executionHistory.externalCalls.clarityCallHistory,
      callType: callTypeCRA.clarityCallHistory
    });
  }

  if (data.executionHistory?.externalCalls?.factorTrustCallHistory) {
    externalCalls.push({
      ...data.executionHistory.externalCalls.factorTrustCallHistory,
      callType: callTypeCRA.factorTrustCallHistory
    });
  }

  const mappedExternalCalls = externalCalls.map((externalCall) => ({
    id: externalCall.callType,
    api: externalCall.callType,
    time:
      externalCall.executionTimeSpan && externalCall.executionTimeSpan / 1000,
    result: externalCall.result,
    scores: externalCall.detailedResults,
    requestJson: externalCall.requestJson,
    responseJson: externalCall.responseJson
  }));

  return [leadRequest, ...mappedExternalCalls];
};

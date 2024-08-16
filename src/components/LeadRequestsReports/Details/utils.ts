import { COLUMN_IDS, FormattedData } from './types';

import { LeadRequestsReport } from '@domain/leadRequestsReports';

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

export const getFormattedData = (data: LeadRequestsReport) => {
  const leadRequest = {
    id: data.id,
    api: 'Input',
    time: data.processingMetadata?.executionTimeSpan
      ? data.processingMetadata.executionTimeSpan / 1000
      : null,
    result: data.output?.decision || null,
    scores: null,
    requestJson: data.leadRequest ? JSON.stringify(data.leadRequest) : null,
    responseJson: data.leadResponse ? JSON.stringify(data.leadResponse) : null
  };

  const externalCalls = (data.executionHistory?.externalCalls || []).map(
    (externalCall) => ({
      id: externalCall.callType,
      api: externalCall.callType,
      time: externalCall.executionTime && externalCall.executionTime / 1000,
      result: externalCall.result,
      scores: externalCall.detailedResults,
      requestJson: externalCall.requestJson,
      responseJson: externalCall.responseJson
    })
  );

  return [leadRequest, ...externalCalls];
};

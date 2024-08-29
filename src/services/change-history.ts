import { api } from '@utils/api.ts';
import { ChangeHistoryRecord } from '@domain/changeHistory.ts';

class ChangeHistoryService {
  async getList(pageNumber: number = 1, pageSize: number = 10) {
    const { data } = await api.get<ChangeHistoryRecord[]>('/change-history', {
      params: {
        pageNumber,
        pageSize
      }
    });
    return data;
  }
}

export const changeHistoryService = new ChangeHistoryService();

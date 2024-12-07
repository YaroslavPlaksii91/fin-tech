import { DataDictionaryVariable } from '@domain/dataDictionary';
export interface IEntity {
  id: string;
  createdBy: string;
  createdOn: string;
  editedBy: string;
  editedOn: string;
}

export type JSONPatchOperation = {
  value?:
    | string
    | Pick<
        DataDictionaryVariable,
        'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
      >;
  path: string;
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy';
  from?: string;
};

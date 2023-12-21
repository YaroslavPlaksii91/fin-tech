export interface IEntity {
  id: string;
  createdBy: string;
  createdOn: string;
  editedBy: string;
  editedOn: string;
}

export type JSONPatchOperation = {
  value: string;
  path: string;
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy';
  from?: string;
};

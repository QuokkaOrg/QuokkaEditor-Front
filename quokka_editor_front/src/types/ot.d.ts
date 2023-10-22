export type Pos = {
  line: number;
  ch: number;
};

export type OperationType = {
  type: string | undefined;
  text: string[];
  from_pos: Pos;
  to_pos: Pos;
  revision: number;
};

export type ClientState = {
  lastSyncedRevision: number;
  pendingChanges: OperationType[];
  sentChanges: OperationType | null;
  documentState: string;
};

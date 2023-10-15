export type Pos = {
  line: number;
  ch: number;
};

export type Operation = {
  type: string | undefined;
  text: string[];
  from_pos: Pos;
  to_pos: Pos;
  revision: number;
};

export type ClientState = {
  lastSyncedRevision: number;
  pendingChanges: Operation[];
  sentChanges: Operation | null;
  documentState: string;
};
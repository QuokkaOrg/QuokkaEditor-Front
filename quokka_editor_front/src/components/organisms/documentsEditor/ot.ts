import { OperationInputs } from "../../../consts";
import { Pos, OperationType, ClientState } from "../../../types/ot";

export const sendChanges = (
  socket: React.MutableRefObject<WebSocket | null>,
  client: ClientState,
  setClient: React.Dispatch<React.SetStateAction<ClientState>>
) => {
  if (client.sentChanges === null && client.pendingChanges.length !== 0) {
    const operationToSend: OperationType = {
      ...client.pendingChanges[0],
      revision: client.lastSyncedRevision,
    };
    socket.current?.send(JSON.stringify(operationToSend));
    setClient({
      ...client,
      sentChanges: operationToSend,
      pendingChanges: client.pendingChanges.slice(1),
    });
  }
};

const adjustPosition = (newPos: Pos, prevPos: Pos, prevText: string) => {
  if (
    newPos.line < prevPos.line ||
    (newPos.line === prevPos.line && newPos.ch < prevPos.ch) ||
    newPos.line > prevPos.line
  ) {
    return newPos;
  }
  if (newPos.line === prevPos.line) {
    return {
      line: newPos.line,
      ch: newPos.ch + prevText.length,
    };
  }
  return {
    line: newPos.line + 1,
    ch: newPos.ch,
  };
};

export const transform = (newOp: OperationType, prevOp: OperationType) => {
  const inputAddTypes = [
    OperationInputs.INPUT,
    OperationInputs.PASTE,
    OperationInputs.UNDO,
  ];
  if (newOp.type === undefined || prevOp.type === undefined) return prevOp;
  if (
    inputAddTypes.includes(newOp.type) &&
    inputAddTypes.includes(prevOp.type)
  ) {
    const adjustedFrom_pos = adjustPosition(
      newOp.from_pos,
      prevOp.from_pos,
      prevOp.text[0]
    );
    const adjustedTo_pos = adjustPosition(
      prevOp.from_pos,
      newOp.from_pos,
      prevOp.text[0]
    );

    return {
      from_pos: adjustedFrom_pos,
      to_pos: adjustedTo_pos,
      text: newOp.text,
      type: OperationInputs.INPUT,
      revision: newOp.revision,
    };
  }

  if (
    inputAddTypes.includes(newOp.type) &&
    prevOp.type === OperationInputs.DELETE
  ) {
    if (
      newOp.from_pos.line < prevOp.from_pos.line ||
      (newOp.from_pos.line === prevOp.from_pos.line &&
        newOp.from_pos.ch <= prevOp.from_pos.ch)
    ) {
      return newOp;
    }
    return {
      from_pos: { line: newOp.from_pos.line - 1, ch: newOp.from_pos.ch },
      to_pos: newOp.to_pos,
      text: newOp.text,
      type: OperationInputs.INPUT,
      revision: newOp.revision,
    };
  }

  if (
    newOp.type === OperationInputs.DELETE &&
    inputAddTypes.includes(prevOp.type)
  ) {
    const adjustedfrom_pos = adjustPosition(
      newOp.from_pos,
      prevOp.from_pos,
      prevOp.text[0]
    );
    return {
      from_pos: adjustedfrom_pos,
      to_pos: newOp.to_pos,
      text: newOp.text,
      type: OperationInputs.DELETE,
      revision: newOp.revision,
    };
  }

  if (
    newOp.type === OperationInputs.DELETE &&
    prevOp.type === OperationInputs.DELETE
  ) {
    if (newOp.from_pos.line <= prevOp.from_pos.line) {
      return newOp;
    }
    return {
      from_pos: { line: newOp.from_pos.line, ch: newOp.from_pos.ch },
      to_pos: newOp.to_pos,
      text: newOp.text,
      type: OperationInputs.DELETE,
      revision: newOp.revision,
    };
  }

  throw new Error("Invalid OperationInputs");
};

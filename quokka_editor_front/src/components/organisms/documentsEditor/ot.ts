import { Operation } from "../../../consts";
import { Pos, OperationType } from "../../../types/ot";

const adjustPosition = (newPos: Pos, prevPos: Pos, prevText: string) => {
  if (
    newPos.line < prevPos.line ||
    (newPos.line === prevPos.line && newPos.ch <= prevPos.ch)
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

const transform = (newOp: OperationType, prevOp: OperationType) => {
  if (newOp.type === Operation.INPUT && prevOp.type === Operation.INPUT) {
    const adjustedfrom_pos = adjustPosition(
      newOp.from_pos,
      prevOp.from_pos,
      prevOp.text[0]
    );
    return {
      from_pos: adjustedfrom_pos,
      to_pos: newOp.to_pos,
      text: newOp.text,
      type: Operation.INPUT,
      revision: newOp.revision,
    };
  }

  if (newOp.type === Operation.INPUT && prevOp.type === Operation.DELETE) {
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
      type: Operation.INPUT,
      revision: newOp.revision,
    };
  }

  if (newOp.type === Operation.DELETE && prevOp.type === Operation.INPUT) {
    const adjustedfrom_pos = adjustPosition(
      newOp.from_pos,
      prevOp.from_pos,
      prevOp.text[0]
    );
    return {
      from_pos: adjustedfrom_pos,
      to_pos: newOp.to_pos,
      text: newOp.text,
      type: Operation.DELETE,
      revision: newOp.revision,
    };
  }

  if (newOp.type === Operation.DELETE && prevOp.type === Operation.DELETE) {
    if (newOp.from_pos.line <= prevOp.from_pos.line) {
      return newOp;
    }
    return {
      from_pos: { line: newOp.from_pos.line, ch: newOp.from_pos.ch },
      to_pos: newOp.to_pos,
      text: newOp.text,
      type: Operation.DELETE,
      revision: newOp.revision,
    };
  }

  throw new Error("Invalid operations");
};

import { LogLevel } from "./logger";

export const WEBSOCKET_URL = "ws://localhost:8100/ws";
export const PARSER_STYLES_URL = "https://cdn.jsdelivr.net/npm/latex.js/dist/";
export const LOG_LEVEL: LogLevel = "log";
export const DEFAULT_PAGE_PARAMS = "?page=1&size=18";

export const OperationInputs = {
  INPUT: "+INPUT",
  DELETE: "+DELETE",
  PASTE: "PASTE",
  UNDO: "UNDO",
};

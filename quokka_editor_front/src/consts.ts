import { LogLevel } from "./logger";

export const API_URL = "http://localhost:8100/";
export const WEBSOCKET_URL = "ws://localhost:8100/ws";
export const PARSER_STYLES_URL = "https://cdn.jsdelivr.net/npm/latex.js/dist/";
export const LOG_LEVEL: LogLevel = "log";

export const OperationInputs = {
  INPUT: "+INPUT",
  DELETE: "+DELETE",
  PASTE: "PASTE",
  UNDO: "UNDO",
};

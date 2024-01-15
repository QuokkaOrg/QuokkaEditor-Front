import { LogLevel } from "./logger";

export const WEBSOCKET_URL = "ws://localhost:8100/ws";
export const PARSER_STYLES_URL = "https://cdn.jsdelivr.net/npm/latex.js/dist/";
export const LOG_LEVEL: LogLevel = "log";
export const DEFAULT_PAGE_PARAMS = "?page=1&size=14";
export const TOAST_OPTIONS = {
  style: { backgroundColor: "#295E6ECC", color: "white" },
};

export const TOAST_MESSAGE = {
  deleted: "Project deleted!",
  urlCopied: "URL copied to clipboard!",
  privilegesChanged: "Privileges changed!",
  documentShared: "Your document is now shared",
  documentNotShared: "Your document is no longer shared",
  logOut: "Succesfully logged out!",
  userUpdated: "User informations succesfully updated!",
  documentAdded: "Succesfully added new document!",
  documentDeleted: "Succesfully deleted current document!",
};

export const OperationInputs = {
  INPUT: "+INPUT",
  DELETE: "+DELETE",
  PASTE: "PASTE",
  UNDO: "UNDO",
};

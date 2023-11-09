import { LOG_LEVEL } from "./consts";

/** Signature of a logging function */
export interface LogFn {
  (message?: unknown, ...optionalParams: unknown[]): void;
}

/** Basic logger interface */
export interface Logger {
  log: LogFn;
  warn: LogFn;
  error: LogFn;
}

/** Log levels */
export type LogLevel = "log" | "warn" | "error";

const NO_LOG: LogFn = () => null;

/** Logger which outputs to the browser console */
export class ConsoleLogger implements Logger {
  readonly log: LogFn;
  readonly warn: LogFn;
  readonly error: LogFn;

  constructor(options?: { level?: LogLevel }) {
    const { level } = options || {};

    this.error = console.error.bind(console);

    if (level === "error") {
      this.warn = NO_LOG;
      this.log = NO_LOG;

      return;
    }

    this.warn = console.warn.bind(console);

    if (level === "warn") {
      this.log = NO_LOG;

      return;
    }

    this.log = console.log.bind(console);
  }
}

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export default logger;

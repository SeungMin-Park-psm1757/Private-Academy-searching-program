type LogLevel = "info" | "warn" | "error";

export interface LogContext {
  requestId?: string;
  route?: string;
  module?: string;
  [key: string]: unknown;
}

export interface Logger {
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
}

function writeLog(level: LogLevel, message: string, context: LogContext): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  const serialized = JSON.stringify(entry);

  if (level === "error") {
    console.error(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.info(serialized);
}

export function createLogger(baseContext: LogContext = {}): Logger {
  return {
    info(message, context = {}) {
      writeLog("info", message, { ...baseContext, ...context });
    },
    warn(message, context = {}) {
      writeLog("warn", message, { ...baseContext, ...context });
    },
    error(message, context = {}) {
      writeLog("error", message, { ...baseContext, ...context });
    },
  };
}

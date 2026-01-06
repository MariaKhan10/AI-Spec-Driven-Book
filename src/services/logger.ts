/**
 * Logging utility for the AI Content Personalizer
 */

export interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000; // Keep only last 1000 logs

  log(level: 'info' | 'warn' | 'error' | 'debug', message: string, context?: Record<string, any>): void {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context
    };

    this.logs.push(logEntry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Output to console
    this.outputToConsole(logEntry);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>): void {
    this.log('error', message, context);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  private outputToConsole(entry: LogEntry): void {
    const formattedTime = entry.timestamp.toISOString();
    const contextStr = entry.context ? ` - Context: ${JSON.stringify(entry.context)}` : '';

    switch (entry.level) {
      case 'error':
        console.error(`[${formattedTime}] ERROR: ${entry.message}${contextStr}`);
        break;
      case 'warn':
        console.warn(`[${formattedTime}] WARN: ${entry.message}${contextStr}`);
        break;
      case 'info':
        console.info(`[${formattedTime}] INFO: ${entry.message}${contextStr}`);
        break;
      case 'debug':
        console.debug(`[${formattedTime}] DEBUG: ${entry.message}${contextStr}`);
        break;
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs]; // Return a copy
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = new Logger();
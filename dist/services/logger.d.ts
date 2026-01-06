/**
 * Logging utility for the AI Content Personalizer
 */
export interface LogEntry {
    timestamp: Date;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    context?: Record<string, any>;
}
declare class Logger {
    private logs;
    private maxLogs;
    log(level: 'info' | 'warn' | 'error' | 'debug', message: string, context?: Record<string, any>): void;
    info(message: string, context?: Record<string, any>): void;
    warn(message: string, context?: Record<string, any>): void;
    error(message: string, context?: Record<string, any>): void;
    debug(message: string, context?: Record<string, any>): void;
    private outputToConsole;
    getLogs(): LogEntry[];
    clearLogs(): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map
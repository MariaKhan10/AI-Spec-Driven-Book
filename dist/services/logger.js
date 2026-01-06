"use strict";
/**
 * Logging utility for the AI Content Personalizer
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
class Logger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000; // Keep only last 1000 logs
    }
    log(level, message, context) {
        const logEntry = {
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
    info(message, context) {
        this.log('info', message, context);
    }
    warn(message, context) {
        this.log('warn', message, context);
    }
    error(message, context) {
        this.log('error', message, context);
    }
    debug(message, context) {
        this.log('debug', message, context);
    }
    outputToConsole(entry) {
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
    getLogs() {
        return [...this.logs]; // Return a copy
    }
    clearLogs() {
        this.logs = [];
    }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map
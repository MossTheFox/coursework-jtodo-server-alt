import { inspect } from 'util';

export function debugLogger(message: any, prefix?: string) {
    if (process.env.NODE_ENV === "development") {
        if (typeof message === "object") {
            message = inspect(message);    // avoid circular reference
        }
        console.log(`[${new Date().toLocaleString()}] [${prefix || "dbConnection"}] [debug] ${message}`);
    }
}
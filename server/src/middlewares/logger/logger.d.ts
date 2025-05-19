import { DUserDTO } from "#controllers/user";
import DUser from "#controllers/user/DTO/DB/DUserDTO";

export interface CustomLoggerData {
    system: {
        ip: string;
    };
}

export interface CustomLogger {
    info: (message: string, args: CustomLoggerDetails) => void;
    warn: (message: string, args: CustomLoggerDetails) => void;
    error: (message: string, args: CustomLoggerDetails) => void;
    sql: (message: string, args: CustomLoggerDetails) => void;
    admin: (message: string, args: CustomLoggerDetails) => void;
    session: (message: string, args: CustomLoggerDetails) => void;
    debug: (message: string, args: CustomLoggerDetails) => void;
}

export interface CustomLoggerDetails {
    details?: any;
    error?: any;
    func?: string;
}

declare global {
    namespace Express {
        export interface Request {
            loggerData?: CustomLoggerData;
            logger: CustomLogger;
        }
    }
}

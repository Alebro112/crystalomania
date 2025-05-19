import dotenv from 'dotenv'
dotenv.config()

import winston from "winston";
import fs from "fs";
import path from "path";
import Transport from "winston-transport";
import util from "util";

// const getLoggerFilePath = (type) => {
//     const logDir = path.join(process.cwd(), "logs", type);
//     const now = new Date();
//     const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
//     const monthStr = dateStr.slice(0, 7); // YYYY-MM
//     const hourStr = String(now.getHours()).padStart(2, "0"); // HH
//     const fileName = `${dateStr}-${hourStr}.${type}.json`;
//     const fullPath = path.join(logDir, monthStr, fileName);

//     // Создаём директории, если их нет
//     fs.mkdirSync(path.dirname(fullPath), { recursive: true });

//     return fullPath;
// };

// const reorderObject = (obj, firstKeys, defaultValues = {}) => ({
//     ...Object.fromEntries(firstKeys.map(key => [key, obj[key] ?? defaultValues[key] ?? null])),
//     ...obj
// });


const customLevels = {
    levels: {
        sql: 6,
        debug: 5,
        info: 4,
        session: 3,
        admin: 2,
        warn: 1,
        error: 0,
    },
    colors: {
        debug: 'green',
        sql: 'yellow',
        info: 'blue',
        session: 'cyan',
        admin: 'magenta',
        warn: 'yellow',
        error: 'red',
    },
};

class CustomTransport extends Transport {
    constructor(opts?: Transport.TransportStreamOptions) {
        super(opts);
    }

    log(info: any, callback: () => void): any {
        setImmediate(() => {
            this.emit('logged', info);
        });

        // Perform the writing to the remote service

        // const filePath = getLoggerFilePath(info.level);
        // fs.readFile(filePath, 'utf8', (err, data) => {
        //     let jsonArray = [];

        //     if (err && err.code !== 'ENOENT') {
        //         console.error('Ошибка при чтении файла:', err);
        //         return;
        //     }

        //     // Если файл существует и содержит данные
        //     if (data && data.trim() !== '') {
        //         try {
        //             jsonArray = JSON.parse(data); // Преобразуем данные в объект
        //         } catch (parseError) {
        //             console.error(`Ошибка при парсинге {${filePath}} JSON:`, parseError);
        //             return;
        //         }
        //     }

        //     // Добавляем новый объект в массив
        //     jsonArray.push(reorderObject(info, ['message', 'level', 'timestamp', 'details', 'error', 'user', 'system']));

        //     // Записываем обновлённый массив в файл (перезапись файла с добавленным объектом)
        //     fs.writeFile(filePath, JSON.stringify(jsonArray, null, 2), 'utf8', (writeError) => {
        //         if (writeError) {
        //             console.error('Ошибка при записи в файл:', writeError);
        //         }
        //     });
        // });

        callback();
    }
};

const logFormat = winston.format.printf(function (info) {
    return `${info.level}: ${JSON.stringify({
        message: info.message,
        details: info.details,
        error: info.error
    }, null, 4)}\n`;
});


const logger = winston.createLogger({
    levels: customLevels.levels,
    level: process.env.NODE_ENV === "local" ? "sql" : "info",
    format: winston.format.combine(
        winston.format.timestamp(), // adds a timestamp property
        winston.format.json()
    ),
    transports: [
        new CustomTransport(),
        new winston.transports.Console({
            level: process.env.NODE_ENV === "local" ? "debug" : "error",
            format: winston.format.combine(winston.format.colorize(), logFormat)
        }),
    ],
})

winston.addColors(customLevels.colors);

interface ExtendedLogger extends winston.Logger {
    session: winston.LeveledLogMethod,
    sql: winston.LeveledLogMethod,
    admin: winston.LeveledLogMethod
}

export default logger as ExtendedLogger
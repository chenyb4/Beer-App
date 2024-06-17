const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: timestamp(), // Base format
    transports: [
        new transports.File({
            filename: 'logs/app.log',
            format: combine(timestamp(), logFormat) // Plain format for file
        }),
        new transports.Console({
            format: combine(colorize(), logFormat) // Colored format for console
        })
    ],
});

module.exports = logger;

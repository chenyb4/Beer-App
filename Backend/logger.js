const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: combine(
        colorize(),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.File({ filename: 'logs/app.log' }),
        new transports.Console()
    ],
});

module.exports = logger;

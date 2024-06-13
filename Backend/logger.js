const winston = require('winston');
const { createLogger, transports } = require('winston');
const chalk = require('chalk');

// Custom function to colorize log levels with chalk
const colorizeLogLevel = level => {
    switch (level) {
        case 'info':
            return chalk.blue(level.toUpperCase()); // Example: Blue for 'info'
        case 'warn':
            return chalk.yellow(level.toUpperCase()); // Example: Yellow for 'warn'
        case 'error':
            return chalk.red(level.toUpperCase()); // Example: Red for 'error'
        default:
            return level.toUpperCase(); // Default: No color for other levels
    }
};

// Define the Winston format with custom colorization and printf function
const alignColorsAndTime = winston.format.combine(
    winston.format.label({ label: '[LOGGER]' }),
    winston.format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => {
        const methodColor = colorizeLogLevel(info.level); // Colorize log level
        const timestampColor = chalk.gray(info.timestamp); // Colorize timestamp
        const messageColor = chalk.green(info.message); // Colorize message

        return `${info.label} ${timestampColor} ${methodColor} ${messageColor}`;
    })
);

// Create Winston logger instance
const logger = createLogger({
    level: 'debug',
    transports: [
        new transports.File({ filename: 'logs/app.log' }),
        new transports.Console({
            format: alignColorsAndTime // Apply the defined format to Console transport
        })
    ],
});

module.exports = logger;

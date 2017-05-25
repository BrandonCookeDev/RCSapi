var winston	= require('winston');
require('winston-daily-rotate-file');

var transport = new winston.transports.DailyRotateFile({
    filename: 'RCSapi',
    datePattern: '.yyyy-MM-dd.log',
    level: 'warn',
    colorize: false,
    handleException: true,
    json: false
});
var logConsole = new winston.transports.Console({
    level: 'info',
    colorize: true,
    handleException: true,
    json: false
});
var log = new (winston.Logger)({
    transports: [
        transport,
        logConsole
    ]
});

module.exports = log;
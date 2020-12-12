let winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => {
          return `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`;
      })
    ),
    defaultMeta: { service: 'request-processor' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.Console(),
      new winston.transports.File({ 
                filename: 'log/error.log', 
                level: 'error', 
                handleExceptions: true,
                prettyPrint:true }),
      new winston.transports.File({ filename: 'log/combined.log' })
    ],exitOnError:false,
    exceptionHandlers: [
      new winston.transports.File({ filename: 'exceptions.log' })
    ]
  });
  
  module.exports=logger;
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  // 
  //if (process.env.NODE_ENV !== 'production') {
  //  logger.add(new winston.transports.Console({
  //    format: winston.format.simple()
  //  }));
  //}
import winston from "winston";

const logger= winston.createLogger({
    transports:[
        new winston.transports.Console({level:"http"}),
        new winston.transports.File({level:"warn", filename:"./src/logs/errors.log"})
    ]
})


export const addLogger=(req,res,next)=>{
    req.logger= logger;
    req.logger.http(`metodo: ${req.method} - url: ${req.url} -  time: ${new Date().toLocaleTimeString()}`)
    next()
}
import winston from "winston";
import {config} from "../config/config.js"

const levels={
    debug:0,
    http:1,
    info:2,
    warning:3,
    error:4,
    fatal:5
}

const devLogger= winston.createLogger({
    level:levels,
    transports:[
        new winston.transports.Console({level:"debug"}),
    ]
})

const prodLogger= winston.createLogger({
    level:levels,
    transports:[
        new winston.transports.Console({level:"info"}),
        new winston.transports.File({level:"error", filename:"./src/logs/errors.log"})
    ]
})


export const addLogger=(req,res,next)=>{
    config.MODE == "DEV"? req.logger= devLogger : req.logger= prodLogger
    next()
}

import Chalk from "chalk";
import httpResponseHandler from "./httpResponseHandler.mjs";
import fs from "fs/promises"

let COLORS = {};
COLORS[httpResponseHandler.HTTPMethods.POST] = Chalk.yellow;
COLORS[httpResponseHandler.HTTPMethods.PATCH] = Chalk.yellow;
COLORS[httpResponseHandler.HTTPMethods.PUT] = Chalk.yellow;
COLORS[httpResponseHandler.HTTPMethods.GET] = Chalk.green;
COLORS[httpResponseHandler.HTTPMethods.DELETE] = Chalk.red;
COLORS.Default = Chalk.gray;

const colorize = (method) => {
    if (method in COLORS) {
        return COLORS[method](method);
    }
    return COLORS.Default(method);
};

class SuperLogger {

    static LOGGING_LEVELS = {
        ALL: 0,
        VERBOSE: 5,
        NORMAL: 10,
        IMPORTANT: 100,
        CRTICAL: 999
    };

    #globalThreshold = SuperLogger.LOGGING_LEVELS.ALL;

    #loggers;

    static instance = null;

    constructor() {
        if (SuperLogger.instance == null) {
            SuperLogger.instance = this;
            this.#loggers = [];
            this.#globalThreshold = SuperLogger.LOGGING_LEVELS.NORMAL;
        }
        return SuperLogger.instance;
    }

    static log(msg, logLevl = SuperLogger.LOGGING_LEVELS.NORMAL) {
        let logger = new SuperLogger();
        if (logger.#globalThreshold > logLevl) {
            return;
        }
        logger.#writeToLog(msg);
    }

    createAutoHTTPRequestLogger() {
        return this.createLimitedHTTPRequestLogger({ threshold: SuperLogger.LOGGING_LEVELS.NORMAL });
    }

    createLimitedHTTPRequestLogger(options) {
        const threshold = options.threshold || SuperLogger.LOGGING_LEVELS.NORMAL;

        return (req, res, next) => {
            if (this.#globalThreshold > threshold) {
                return;
            }

            this.#LogHTTPRequest(req, res, next);
        }

    }

    #LogHTTPRequest(req, res, next) {
        // TODO: Extract and format information important for your dev process. 
        let type = req.method;
        const path = req.originalUrl;
        const when = new Date().toLocaleTimeString();

        // TODO: This is just one simple thing to create structure and order. Can you do more?
        type = colorize(type);
        this.#writeToLog([when, type, path].join(" "));

        next();
    }

    #writeToLog(msg) {

        msg += "\n";
        console.log(msg);
        ///TODO: The files should be based on current date.
        // ex: 300124.log
        // fs.appendFile("./log.txt", msg, { encoding: "utf8" }, (err) => { });
    }
}


export default SuperLogger
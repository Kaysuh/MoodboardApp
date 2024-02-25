class httpResponseHandler {
    static #httpStatusMessages = {
        200: 'OK',
        201: 'Created',
        400: 'Bad Request',
        404: 'Not Found',
        500: 'Internal Server Error',
    };

    static HTTPMethods = {
        POST: "POST",
        GET: "GET",
        PUT: "PUT",
        PATCH: "PATCH",
        DELETE: "DELETE"
    }
    static handleResponse(req, res, next) {
        res.sendSuccess = (data, statusCode = 200) => {
            res.status(statusCode).json({
                status: httpResponseHandler.#httpStatusMessages[statusCode],
                data: data,
            });
        };

        res.sendError = (err, statusCode = 500) => {
            console.error(err);
            res.status(statusCode).json({
                status: httpResponseHandler.#httpStatusMessages[statusCode] || 'Error',
                message: err instanceof Error ? err.message : err,
                error: {},
            });
        };

        next();
    }

    static errorHandler(err, req, res, next) {
        res.sendError(err, err.statusCode || 500);
    }
}

export default httpResponseHandler;

class httpResponseHandler {
    static #instance = null;
    static #httpStatusMessages = {
        200: 'OK',
        201: 'Created',
        400: 'Bad Request',
        404: 'Not Found',
        500: 'Internal Server Error',
    };

    constructor() {
        if (!httpResponseHandler.#instance) {
            httpResponseHandler.#instance = this;
        }
        return httpResponseHandler.#instance;
    }

    static handleResponse(req, res, err = null, statusCode = 200, data = null) {
        if (err) {
            console.error(err);
            res.status(statusCode).json({
                status: this.#httpStatusMessages[statusCode],
                message: err.message || 'Error',
                error: err,
            });
        } else {
            res.status(statusCode).json({
                status: this.#httpStatusMessages[statusCode],
                data: data,
            });
        }
    }

}

export default httpResponseHandler;


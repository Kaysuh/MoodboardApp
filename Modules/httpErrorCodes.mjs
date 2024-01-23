class HttpCodes {
    //TODO: Add more specific error handling
    static SuccesfullRespons = {
        Ok: 200
    }

    static ClientSideErrorRespons = {
        BadRequest: 400,
        Unauthorized: 401,
        PaymentRequired: 402,
        Forbidden: 404,
        NotFound: 404,
        MethodNotAllowed: 405,
        NotAcceptable: 406
    }

}

export default HttpCodes;
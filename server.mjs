import 'dotenv/config'
import express from 'express' 
import USER_API from './Routes/usersRoute.mjs';

import httpResponseHandler from './Modules/httpResponseHandler.mjs';
import SuperLogger from './Modules/superLogger.mjs';

const server = express();
const port = (process.env.PORT || 3000);
server.set('port', port);

const logger = new SuperLogger()
server.use(logger.createAutoHTTPRequestLogger());
server.use(httpResponseHandler.handleResponse)

server.use(express.json())
server.use(express.static('public'));

server.use("/user", USER_API);

server.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;");
    next();
});

server.get("/", (req, res, next) => {
    res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
});

server.listen(server.get('port'), function () {
    console.log('server online', server.get('port'));
});
import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser';
import USER_API from './Routes/usersRoute.mjs';
import MOODBOARD_API from './Routes/moodboardsRoute.mjs';

import httpResponseHandler from './Modules/httpResponseHandler.mjs';
import SuperLogger from './Modules/superLogger.mjs';

const server = express();
const port = (process.env.PORT || 8080);
server.set('port', port);

server.use(bodyParser.json({ limit: '10mb' }));

const logger = new SuperLogger()
server.use(logger.createAutoHTTPRequestLogger());
server.use(httpResponseHandler.handleResponse)

server.use(express.json())
server.use(express.static('Public'));

server.use("/user", USER_API);
server.use("/moodboard", MOODBOARD_API)

server.listen(server.get('port'), function () {
    console.log('server online', server.get('port'));
});
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
server.use(express.static('Public'));

server.use("/user", USER_API);

server.listen(server.get('port'), function () {
    console.log('server online', server.get('port'));
});
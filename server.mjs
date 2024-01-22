import express from 'express' 
import USER_API from './routes/usersRoute.mjs'; 

const server = express();
const port = (process.env.PORT || 8080);
server.set('port', port);

server.use(express.json()) //Turn the request into json via middleware
server.use(express.static('public'));

server.use("/user", USER_API);

// A get request handler example)
server.get("/", (req, res, next) => {
    res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
});

server.listen(server.get('port'), function () {
    console.log('server online', server.get('port'));
});
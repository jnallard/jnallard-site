import * as express from 'express';
import * as path from 'path';
import * as io from 'socket.io';
import { SocketEvent } from './src/app/shared/models/socket-event';
import { SocketRouting } from './src/server/socket-routing';

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(process.env.PORT || 3000, function() {
    console.log(`Server now listening on ${port}.`);
});
const socketIO = io.listen(server);

const routing = new SocketRouting();
socketIO.on('connect', socket => {
    console.log(`Socket connected: ${socket.id}.`);
    socket.on('event', (socketEvent: SocketEvent) => {
        console.log(socketEvent);
        routing.sendEvent(socket, socketEvent);
    });
});

// Allow any method from any host and log requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        console.log(`${req.ip} ${req.method} ${req.url}`);
        next();
    }
});

// Handle POST requests that come in formatted as JSON
app.use(express.json());

// Serve only the static files from the dist directory
app.use(express.static(__dirname + '/dist/my-app'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/my-app/index.html'));
});



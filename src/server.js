require('dotenv').config();

const fs = require('fs');
const path = require('path');
const https = require('https');

const WebSocket = require('ws');

const { Router } = require('./router.js');
const { PageHandler } = require('./pagehandler.js');
const { NodeSpotify } = require('./nodespotify.js');


const router = new Router();
const pagehandler = new PageHandler();
const nodespotify = new NodeSpotify(process.env.SPOTIFY_ACCESS_TOKEN);

pagehandler.addPage(path.join(__dirname, 'public/index.html'));
pagehandler.addPage(path.join(__dirname, 'public/404.html'));

router.addRoute('/', (request, response, parsedUrl) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(pagehandler.getPage('index.html').data);
    return response;
});

router.addRoute('/login', (request, response, parsedUrl) => {
    const state = parsedUrl.searchParams.get('state');
    if (!state) {
        throw new Error('No authorization state!');
    }

    response.writeHead(301, { Location: nodespotify.createAuthorizeUrl(process.env.SPOTIFY_CLIENT_ID, path.join(process.env.HOST, 'callback'), state) });
    return response;
});

router.addRoute('/callback', (request, response, parsedUrl) => {
    console.log(parsedUrl.searchParams);
    response.writeHead(301, { Location: router.findRoute('/').path });
    return response;
});

const server = https.createServer({
    cert: fs.readFileSync(path.resolve(__dirname, '../ssl/localhost.crt')),
    key: fs.readFileSync(
        path.resolve(__dirname, '../ssl/localhost.key'),
    ),
});

const wss = new WebSocket.Server({ noServer: true });

server.on('request', (request, response) => {
    const parsedUrl = new URL(request.url, `http://${request.headers.host}`);

    try {
        response = router.resolve(parsedUrl.pathname, request, response, parsedUrl).result;
        response.end();
    }
    catch (error) {
        console.error(error);
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.write(pagehandler.getPage('404.html').data);
        response.end();
        return;
    }
});

/*
server.on('upgrade', (request, socket, head) => {
    const pathname = url.parse(request.url).pathname;
    if (pathname === '/ntp') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});
*/

wss.on('connection', (ws) => {
    ws.on('message', (msg) => {
        if (msg === 'start_sync') {
            setInterval(() => {
                ws.send();
            }, 5000);
        }
        console.log(`Received: ${msg}`);
        ws.send(`You said: ${msg}; How's it going?`);
    });
});

server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));

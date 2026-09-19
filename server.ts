import { createServer, IncomingMessage, Server } from 'http';
import next from 'next';
import Stream from 'stream';
import { parse } from 'url';
import WebSocket, { WebSocketServer } from 'ws';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const clients: Set<WebSocket> = new Set();

app.prepare().then(() => {

    const server: Server = createServer((req, res) => {
        handle(req, res);
    }).listen(port);

    const wss = new WebSocketServer({
        noServer: true,
    });

    wss.on("connection", function (ws: WebSocket) {

        clients.add(ws);

        ws.on("message", function (message: Buffer) {

            clients.forEach(function (client) {
                if (!(client.readyState === WebSocket.OPEN)) return;
                client.send(message,)
            });

        });

        ws.on("close", function () {
            clients.delete(ws);
        });

    });

    server.on("upgrade", function (request: IncomingMessage, socket: Stream.Duplex, head: Buffer) {

        const { pathname } = parse(request.url || "/", true);

        if (pathname === "/_next/webpack-hmr/") app.getUpgradeHandler()(request, socket, head);

        if (pathname === "/api/ws") wss.handleUpgrade(request, socket, head, function (ws) {
            wss.emit("connection", ws, request);
        });

    });

    console.log(`Server Running\n[HOST]: http://localhost:${port}\n[ENV]: ${dev ? 'development' : process.env.NODE_ENV}`)
});
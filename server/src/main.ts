import { ServerContext } from './context/context';
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import { Room } from './models/room.model';
import { UserState } from './enums';
import { log } from './helpers';
import * as figlet from 'figlet';
import * as fs from 'fs';
import * as path from 'path';

class Server {
    public expressApp: express.Application;
    private httpServer: any;
    private context: ServerContext;
    private api: any;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.context = new ServerContext();
        this.context.rooms = [];
        this.context.users = [];

        this.expressApp = express();
        this.httpServer = http.createServer(this.expressApp);
        this.context.io = socketIo(this.httpServer);

        console.log(figlet.textSync('Welcome'));
        this.api = this.getApi();
        this.listen();
    }

    private getApi() {
        const api = {};
        fs.readdirSync(path.join(__dirname, 'endpoints'))
            .filter(filename => filename.includes('.api.'))
            .forEach(endpointName => {
                const apiEndpoint = require(path.join(__dirname, 'endpoints', endpointName));

                for (const eventName in apiEndpoint) {
                    log(`Initializing event '${endpointName}.${eventName}'`);
                    api[eventName] = apiEndpoint[eventName]
                }
            });

        return api;
    }

    private listen(): void {
        this.httpServer.listen(8080, () => {
            log('Waiting for connections...');
        });

        this.context.io.on('connect', (socket: SocketIO.Socket) => {
            log(`Connected client on port ${socket.client.id}`);

            for (const eventName in this.api) {
                socket.on(eventName, (...args) => {
                    const currentUser = this.context.users.find(user => user.clientId === socket.client.id);
                    this.api[eventName].apply(null, [socket, this.context, currentUser, ...args]);
                });
            };

            socket.on('disconnect', () => {
                log('Client disconnected');
            });
        });
    }
}

export default Server.bootstrap().expressApp;

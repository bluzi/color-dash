import { ServerContext } from './context/context';
import { User } from './models/userModel';
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import { Room } from '../../src/models/room.model';
import { UserState } from './enums';
import services from './services';
import { log } from './log';
import * as figlet from 'figlet';

class Server {
    public expressApp: express.Application;
    private httpServer: any;
    private context: ServerContext;

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
        this.listen();
    }

    private listen(): void {
        this.httpServer.listen(8080, () => {
            log('Waiting for connections...');
        });

        this.context.io.on('connect', (socket: SocketIO.Socket) => {
            log(`Connected client on port ${socket.client.id}`);


            services.forEach(service => {
                const serviceApi = require(`./services/${service}`);

                Object.keys(serviceApi).forEach(eventName => {
                    log(`Initializing event '${eventName}'`);
                    socket.on(eventName, (...args) => {
                        const currentUser = this.context.users.find(user => user.clientId === socket.client.id);
                        serviceApi[eventName].apply(null, [socket, this.context, currentUser, ...args]);
                    });
                })
            });

            socket.on('disconnect', () => {
                log('Client disconnected');
            });
        });
    }
}

export default Server.bootstrap().expressApp;

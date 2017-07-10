import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import { Room } from '../../src/models/room.model';
import { UserState } from './enums';
import { User } from './user';
import services from './services';
import { log } from './log';
import * as figlet from 'figlet';

class Server {
    public expressApp: express.Application;
    private httpServer: any;
    private io: SocketIO.Server;

    private rooms: Room[];

    private users: User[];

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.expressApp = express();
        this.httpServer = http.createServer(this.expressApp);
        this.io = socketIo(this.httpServer);

        this.rooms = [];
        this.users = [];

        console.log(figlet.textSync('Welcome'));
        this.listen();
    }

    private listen(): void {
        this.httpServer.listen(8080, () => {
           log('Waiting for connections...');
        });

        this.io.on('connect', (socket: SocketIO.Socket) => {
            log(`Connected client on port ${socket.client.id}`);


            services.forEach(service => {
                const serviceApi = require(`./services/${service}`);

                Object.keys(serviceApi).forEach(eventName => {
                    log(`Initializing event '${eventName}'`);
                    socket.on(eventName, (...args) => serviceApi[eventName].apply(this, [socket, ...args]));
                })
            });

            socket.on('disconnect', () => {
                log('Client disconnected');
            });
        });
    }

    private generateId() {
        let id = '';
        do {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

            for (let i = 0; i < 3; i++) {
                id += possible.charAt(Math.floor(Math.random() * possible.length));
            }
        } while (this.rooms.some(room => room.roomId === id));

        return id;
    }
}

export default Server.bootstrap().expressApp;

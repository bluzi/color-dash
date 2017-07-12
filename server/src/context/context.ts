import { Room } from './../models/roomModel';
import { User } from './../models/userModel';

export abstract class ServerContextBase {
    users: User[];
    io: SocketIO.Server;
}

export class ServerContext extends ServerContextBase {
    rooms: Room[] = [];
}

import { Room } from './../models/room.model';
import { User } from './../models/user.model';

export abstract class ServerContextBase {
    users: User[];
    io: SocketIO.Server;
}

export class ServerContext extends ServerContextBase {
    rooms: Room[] = [];
}

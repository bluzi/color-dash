import { ServerContext } from './../context/context';
import { UserState } from './../enums';
import { log } from './../log';
import { User } from '../models/userModel';

export function handshake(socket: SocketIO.Socket, context: ServerContext, currentUser: User, accessToken: string, alias: string) {
    const user = context.users.find(u => u.accessToken === accessToken);

    log(`Handshake with ${alias}`, accessToken);

    if (user) {
        user.alias = alias;
        user.clientId = socket.client.id;
        log('User exists');
    } else {
        context.users.push({
            accessToken,
            clientId: socket.client.id,
            alias,
        });
        log('Creating new user');
    }

    // this.rooms
    //     .filter(room => room.members.some(member => member === accessToken))
    //     .forEach(room => {
    //         socket.in(room.roomId).emit('roomChanged', room);

    //         log('Sending connection message');
    //     });

    socket.emit('handshake-response', accessToken);
}

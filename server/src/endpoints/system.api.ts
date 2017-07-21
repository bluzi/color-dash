import { ServerContext } from './../context/context';
import { UserState } from './../enums';
import { log } from './../helpers';
import { User } from '../models/user.model';

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
            score: 0,
        });
        log('Creating new user');
    }

    socket.emit('handshake-response', accessToken);
}

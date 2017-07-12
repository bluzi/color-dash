import { Room } from './../models/roomModel';
import { log } from './../log';
import { User } from './../models/userModel';
import { ServerContext } from '../context/context';

export function press(socket: SocketIO.Socket, context: ServerContext, currentUser: User, accessToken: string) {
    const pressingUser = context.users.find(u => u.accessToken === accessToken);

    if (pressingUser.pressing === currentUser.accessToken && currentUser.color === pressingUser.color) {
        pressingUser.pressing = undefined;

        const room = context.rooms.find(r => !!r.members.find(u => u.accessToken === currentUser.accessToken));

        pressingUser.color = room.getColor();
        context.io.in(pressingUser.clientId).send('colorChanged', pressingUser.color);

        currentUser.color = room.getColor();
        context.io.in(currentUser.clientId).send('colorChanged', currentUser.color);
    } else {
        currentUser.pressing = accessToken;  
        log(`${currentUser.alias} is pressing ${accessToken}`);
    }
    socket.emit('pressResponse', true);
}

export function stopPresing(socket: SocketIO.Socket, context: ServerContext, currentUser: User) {
    log(`user ${currentUser.clientId} is pressing ${currentUser.pressing}`)    
    currentUser.pressing = undefined;
    socket.emit('stopPressingResponse');
}

export function getColor(socket: SocketIO.Socket, context: ServerContext, currentUser: User) {
    log(`${currentUser.alias} asked for his color, answering ${currentUser.color}`);
    socket.emit('getColorResponse', currentUser.color);
}

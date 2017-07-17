import { Room } from './../models/roomModel';
import { log } from './../log';
import { User } from './../models/userModel';
import { ServerContext } from '../context/context';

export function press(socket: SocketIO.Socket, context: ServerContext, currentUser: User, accessToken: string) {
    const pressedUser = context.users.find(u => u.accessToken === accessToken);

    if (pressedUser.pressing === currentUser.accessToken && currentUser.color === pressedUser.color) {
        pressedUser.pressing = undefined;

        log(`Pressing match occured between ${currentUser.alias} and ${pressedUser.alias}`);

        const room = context.rooms.find(r => !!r.members.find(u => u.accessToken === currentUser.accessToken));

        pressedUser.color = room.getColor();
        context.io.in(pressedUser.clientId).emit('colorChanged', pressedUser.color);
        log(`${pressedUser.alias} color changed to ${pressedUser.color}`);

        currentUser.color = room.getColor();
        context.io.in(currentUser.clientId).emit('colorChanged', currentUser.color);
        log(`${currentUser.alias} color changed to ${currentUser.color}`);
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

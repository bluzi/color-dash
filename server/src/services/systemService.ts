import { UserState } from './../enums';
import { log } from './../log';

export function handshake(socket: SocketIO.Socket, accessToken: string) {
    this.users.push({
        accessToken,
        clientId: socket.client.id,
    });

    log('Handshake', accessToken);

    // this.rooms
    //     .filter(room => room.members.some(member => member === accessToken))
    //     .forEach(room => {
    //         socket.in(room.roomId).emit('roomChanged', room);

    //         log('Sending connection message');
    //     });

    socket.emit('handshake-response', accessToken);
}

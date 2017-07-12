"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./../log");
function handshake(socket, context, currentUser, accessToken, alias) {
    const user = context.users.find(u => u.accessToken === accessToken);
    log_1.log(`Handshake with ${alias}`, accessToken);
    if (user) {
        user.alias = alias;
        user.clientId = socket.client.id;
        log_1.log('User exists');
    }
    else {
        context.users.push({
            accessToken,
            clientId: socket.client.id,
            alias,
        });
        log_1.log('Creating new user');
    }
    // this.rooms
    //     .filter(room => room.members.some(member => member === accessToken))
    //     .forEach(room => {
    //         socket.in(room.roomId).emit('roomChanged', room);
    //         log('Sending connection message');
    //     });
    socket.emit('handshake-response', accessToken);
}
exports.handshake = handshake;

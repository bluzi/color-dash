"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./../log");
function handshake(socket, accessToken) {
    this.users.push({
        accessToken,
        clientId: socket.client.id,
    });
    log_1.log('Handshake', accessToken);
    // this.rooms
    //     .filter(room => room.members.some(member => member === accessToken))
    //     .forEach(room => {
    //         socket.in(room.roomId).emit('roomChanged', room);
    //         log('Sending connection message');
    //     });
    socket.emit('handshake-response', accessToken);
}
exports.handshake = handshake;

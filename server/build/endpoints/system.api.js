"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./../helpers");
function handshake(socket, context, currentUser, accessToken, alias) {
    const user = context.users.find(u => u.accessToken === accessToken);
    helpers_1.log(`Handshake with ${alias}`, accessToken);
    if (user) {
        user.alias = alias;
        user.clientId = socket.client.id;
        helpers_1.log('User exists');
    }
    else {
        context.users.push({
            accessToken,
            clientId: socket.client.id,
            alias,
            score: 0,
        });
        helpers_1.log('Creating new user');
    }
    socket.emit('handshake-response', accessToken);
}
exports.handshake = handshake;

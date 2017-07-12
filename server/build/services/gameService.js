"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./../log");
function press(socket, context, currentUser, accessToken) {
    const pressingUser = context.users.find(u => u.accessToken === accessToken);
    if (pressingUser.pressing === currentUser.accessToken && currentUser.color === pressingUser.color) {
        pressingUser.pressing = undefined;
        const room = context.rooms.find(r => !!r.members.find(u => u.accessToken === currentUser.accessToken));
        pressingUser.color = room.getColor();
        context.io.in(pressingUser.clientId).send('colorChanged', pressingUser.color);
        currentUser.color = room.getColor();
        context.io.in(currentUser.clientId).send('colorChanged', currentUser.color);
    }
    else {
        currentUser.pressing = accessToken;
        log_1.log(`${currentUser.alias} is pressing ${accessToken}`);
    }
    socket.emit('pressResponse', true);
}
exports.press = press;
function stopPresing(socket, context, currentUser) {
    log_1.log(`user ${currentUser.clientId} is pressing ${currentUser.pressing}`);
    currentUser.pressing = undefined;
    socket.emit('stopPressingResponse');
}
exports.stopPresing = stopPresing;
function getColor(socket, context, currentUser) {
    log_1.log(`${currentUser.alias} asked for his color, answering ${currentUser.color}`);
    socket.emit('getColorResponse', currentUser.color);
}
exports.getColor = getColor;

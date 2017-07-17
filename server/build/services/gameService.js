"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./../log");
function press(socket, context, currentUser, accessToken) {
    const pressedUser = context.users.find(u => u.accessToken === accessToken);
    if (pressedUser.pressing === currentUser.accessToken && currentUser.color === pressedUser.color) {
        pressedUser.pressing = undefined;
        log_1.log(`Pressing match occured between ${currentUser.alias} and ${pressedUser.alias}`);
        const room = context.rooms.find(r => !!r.members.find(u => u.accessToken === currentUser.accessToken));
        pressedUser.color = room.getColor();
        context.io.in(pressedUser.clientId).emit('colorChanged', pressedUser.color);
        log_1.log(`${pressedUser.alias} color changed to ${pressedUser.color}`);
        currentUser.color = room.getColor();
        context.io.in(currentUser.clientId).emit('colorChanged', currentUser.color);
        log_1.log(`${currentUser.alias} color changed to ${currentUser.color}`);
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

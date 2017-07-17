"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./../log");
function press(socket, context, currentUser, accessToken) {
    const pressedUser = context.users.find(u => u.accessToken === accessToken);
    if (pressedUser.pressing === currentUser.accessToken && currentUser.color === pressedUser.color) {
        log_1.log(`Pressing match occured between ${currentUser.alias} and ${pressedUser.alias}`);
        const room = context.rooms.find(r => !!r.members.find(u => u.accessToken === currentUser.accessToken));
        pressedUser.pressing = undefined;
        currentUser.pressing = undefined;
        currentUser.score++;
        pressedUser.score++;
        if (currentUser.score === 10) {
            room.winner = currentUser.alias;
            log_1.log(`${currentUser.alias} won!`);
        }
        else if (pressedUser.score === 10) {
            room.winner = pressedUser.alias;
            log_1.log(`${pressedUser.alias} won!`);
        }
        else {
            pressedUser.color = room.getColor(pressedUser.color);
            context.io.in(pressedUser.clientId).emit('colorChanged', pressedUser.color);
            log_1.log(`${pressedUser.alias} color changed to ${pressedUser.color}`);
            currentUser.color = room.getColor(currentUser.color);
            context.io.in(currentUser.clientId).emit('colorChanged', currentUser.color);
            log_1.log(`${currentUser.alias} color changed to ${currentUser.color}`);
        }
        context.io.in(room.roomId).emit('roomChanged', room);
    }
    else {
        log_1.log(`${currentUser.alias} is pressing ${pressedUser.alias}`);
        currentUser.pressing = accessToken;
        setTimeout(() => {
            if (currentUser.pressing) {
                log_1.log(`user ${currentUser.clientId} stopped pressing ${pressedUser.alias}`);
                currentUser.pressing = undefined;
                socket.emit('pressResponse', true);
            }
        }, 5000);
    }
}
exports.press = press;
function getColor(socket, context, currentUser) {
    log_1.log(`${currentUser.alias} asked for his color, answering ${currentUser.color}`);
    socket.emit('getColorResponse', currentUser.color);
}
exports.getColor = getColor;

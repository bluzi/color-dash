import { Room } from './../models/roomModel';
import { log } from './../log';
import { User } from './../models/userModel';
import { ServerContext } from '../context/context';
import { RoomState } from '../../../src/models/room.model';

export function press(socket: SocketIO.Socket, context: ServerContext, currentUser: User, accessToken: string) {
    const pressedUser = context.users.find(u => u.accessToken === accessToken);

    if (pressedUser.pressing === currentUser.accessToken && currentUser.color === pressedUser.color) {
        log(`Pressing match occured between ${currentUser.alias} and ${pressedUser.alias}`);

        const room = context.rooms.find(r => !!r.members.find(u => u.accessToken === currentUser.accessToken));

        pressedUser.pressing = undefined;
        currentUser.pressing = undefined;

        currentUser.score++;
        pressedUser.score++;

        if (currentUser.score === 10) {
            room.winner = currentUser.alias;
            room.state = RoomState.Finished;
            log(`${currentUser.alias} won!`);
        } else if (pressedUser.score === 10) {
            room.winner = pressedUser.alias;
            room.state = RoomState.Finished;
            log(`${pressedUser.alias} won!`);
        } else {
            pressedUser.color = room.getColor(pressedUser.color);
            context.io.in(pressedUser.clientId).emit('colorChanged', pressedUser.color);
            log(`${pressedUser.alias} color changed to ${pressedUser.color}`);

            currentUser.color = room.getColor(currentUser.color);
            context.io.in(currentUser.clientId).emit('colorChanged', currentUser.color);
            log(`${currentUser.alias} color changed to ${currentUser.color}`);
        }

        context.io.in(room.roomId).emit('roomChanged', room);
    } else {
        log(`${currentUser.alias} is pressing ${pressedUser.alias}`);

        currentUser.pressing = accessToken;

        setTimeout(() => {
            if (currentUser.pressing) {
                log(`user ${currentUser.clientId} stopped pressing ${pressedUser.alias}`)
                currentUser.pressing = undefined;
                socket.emit('pressResponse', true);
            }
        }, 5000);
    }
}

export function getColor(socket: SocketIO.Socket, context: ServerContext, currentUser: User) {
    log(`${currentUser.alias} asked for his color, answering ${currentUser.color}`);
    socket.emit('getColorResponse', currentUser.color);
}

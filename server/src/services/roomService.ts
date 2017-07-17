import { ServerContext } from './../context/context';
import { Room } from './../models/roomModel';
import { User } from './../models/userModel';
import { UserState, RoomState } from './../enums';
import { log } from './../log';

export function createRoom(socket: SocketIO.Socket, context: ServerContext, currentUser: User) {
    const room: Room = new Room(currentUser, context.rooms);

    socket.join(room.roomId);

    context.rooms.push(room);
    socket.emit('createRoomResponse', room);
    log(`Room created ${room.roomId}`);
}

export function joinRoom(socket: SocketIO.Socket, context: ServerContext, currentUser: User, roomId: string) {
    const room: Room = context.rooms.find(r => r.roomId.toUpperCase() === roomId.toUpperCase());

    if (room) {
        room.members.push(currentUser);
        socket.join(room.roomId);

        socket.in(room.roomId).emit('roomChanged', room);

        socket.emit('joinRoomResponse', room);
        log(`User joined room ${room.roomId}`);
    } else {
        socket.emit('joinRoomResponse', undefined);
        log(`Joining room failed ${roomId}`);
    }
}

export function getCurrentRoom(socket: SocketIO.Socket, context: ServerContext, currentUser: User) {
    const room = context.rooms.find(r => !!r.members.find(u => u.accessToken === currentUser.accessToken));

    if (room) {
        log(`Current room request ${room.roomId} (State: ${room.state})`);
        socket.emit('get-current-room-response', room);
    } else {
        log(`Current room request (Not in a room)`);
        socket.emit('get-current-room-response', undefined);
    }
}

export function leaveRoom(socket: SocketIO.Socket, context: ServerContext, currentUser: User) {
    context.rooms
        .filter(room => room.members.some(member => member.accessToken === currentUser.accessToken))
        .forEach(room => {
            room.members.splice(room.members.indexOf(currentUser), 1);
            room.members = room.members.filter(m => m.accessToken !== currentUser.accessToken);

            if (room.members.length === 0) {
                context.rooms.splice(context.rooms.indexOf(room), 1);
            } else if (room.leader.accessToken === currentUser.accessToken) {
                room.leader = room.members[0];
            }

            socket.leave(room.roomId);

            if (context.rooms.includes(room)) {
                socket.in(room.roomId).emit('roomChanged', room);
            }
        });

    socket.emit('leaveRoomResponse');
}

export function startGame(socket: SocketIO.Socket, context: ServerContext, currentUser: User) {
    const room: Room = context.rooms.find(r => r.leader.accessToken === currentUser.accessToken);

    room.colors = Room.generateRoomColors(room.members.length);


    if (room) {
        room.state = RoomState.GameStarted;

        room.members.forEach(u => u.color = room.getColor());

        socket.emit('startGameResponse', true);
        context.io.in(room.roomId).emit('roomChanged', room);
        log(`Starting game in room ${room.roomId}`);
    } else {
        socket.emit('startGameResponse', false);
    }
}

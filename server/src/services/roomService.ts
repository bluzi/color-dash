import { UserState, RoomState } from './../enums';
import { log } from './../log';
import { Room } from '../../../src/models/room.model';

export function createRoom(socket: SocketIO.Socket) {
    const currentUser = this.users.find(user => user.clientId === socket.client.id);
    const room: Room = {
        leaderId: currentUser.accessToken,
        roomId: this.generateId(),
        members: [currentUser.accessToken],
        state: RoomState.WaitingForPlayers,
    };

    socket.join(room.roomId);

    this.rooms.push(room);
    socket.emit('createRoomResponse', room);
    log(`Room created ${room.roomId}`);
}

export function joinRoom(socket: SocketIO.Socket, roomId: string) {
    const currentUser = this.users.find(user => user.clientId === socket.client.id);
    const room = this.rooms.find(r => r.roomId === roomId);

    if (room) {
        room.members.push(currentUser.accessToken);
        socket.join(room.roomId);

        socket.in(room.roomId).emit('roomChanged', room);

        socket.emit('joinRoomResponse', room);
        log(`User joined room ${room.roomId}`);
    } else {
        socket.emit('joinRoomResponse', undefined);
        log(`Joining room failed ${roomId}`);
    }
}

export function getCurrentRoom(socket: SocketIO.Socket) {
    const currentUser = this.users.find(user => user.clientId === socket.client.id);
    const room: Room = this.rooms.find(r => r.members.indexOf(currentUser.accessToken) > -1);

    if (room) {
        log(`Current room request ${room.roomId} (State: ${room.state})`);
        socket.emit('get-current-room-response', room);
    } else {
        log(`Current room request (Not in a room)`);
        socket.emit('get-current-room-response', undefined);
    }
}

export function leaveRoom(socket: SocketIO.Socket) {
    const currentUser = this.users.find(user => user.clientId === socket.client.id);
    this.rooms
        .filter(room => room.members.some(member => member === currentUser.accessToken))
        .forEach(room => {
            room.members.splice(room.members.indexOf(currentUser.accessToken), 1);

            if (room.members.length === 0) {
                this.rooms.splice(this.rooms.indexOf(room), 1);
            } else if (room.leaderId === currentUser.accessToken) {
                room.leaderId = room.members[0];
            }

            if (this.rooms.includes(room)) {
                socket.in(room.roomId).emit('roomChanged', room);
            }
        });

    socket.emit('leaveRoomResponse');
}

export function startGame(socket: SocketIO.Socket) {
    const currentUser = this.users.find(user => user.clientId === socket.client.id);
    const room: Room = this.rooms.find(r => r.leaderId === currentUser.accessToken);

    if (room) {
        room.state = RoomState.GameStarted;
        socket.emit('startGameResponse', true);
        socket.in(room.roomId).emit('roomChanged', room);
        log(`Starting game in room ${room.roomId}`);
    } else {
        socket.emit('startGameResponse', false);
    }
}

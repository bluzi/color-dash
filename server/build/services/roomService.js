"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roomModel_1 = require("./../models/roomModel");
const enums_1 = require("./../enums");
const log_1 = require("./../log");
function createRoom(socket, context, currentUser) {
    const room = new roomModel_1.Room(currentUser, context.rooms);
    socket.join(room.roomId);
    context.rooms.push(room);
    socket.emit('createRoomResponse', room);
    log_1.log(`Room created ${room.roomId}`);
}
exports.createRoom = createRoom;
function joinRoom(socket, context, currentUser, roomId) {
    const room = context.rooms.find(r => r.roomId.toUpperCase() === roomId.toUpperCase());
    if (room) {
        room.members.push(currentUser);
        socket.join(room.roomId);
        socket.in(room.roomId).emit('roomChanged', room);
        socket.emit('joinRoomResponse', room);
        log_1.log(`User joined room ${room.roomId}`);
    }
    else {
        socket.emit('joinRoomResponse', undefined);
        log_1.log(`Joining room failed ${roomId}`);
    }
}
exports.joinRoom = joinRoom;
function getCurrentRoom(socket, context, currentUser) {
    const room = context.rooms.find(r => !!r.members.find(u => u.accessToken === currentUser.accessToken));
    if (room) {
        log_1.log(`Current room request ${room.roomId} (State: ${room.state})`);
        socket.emit('get-current-room-response', room);
    }
    else {
        log_1.log(`Current room request (Not in a room)`);
        socket.emit('get-current-room-response', undefined);
    }
}
exports.getCurrentRoom = getCurrentRoom;
function leaveRoom(socket, context, currentUser) {
    context.rooms
        .filter(room => room.members.some(member => member.accessToken === currentUser.accessToken))
        .forEach(room => {
        room.members.splice(room.members.indexOf(currentUser), 1);
        room.members = room.members.filter(m => m.accessToken !== currentUser.accessToken);
        if (room.members.length === 0) {
            context.rooms.splice(context.rooms.indexOf(room), 1);
        }
        else if (room.leader.accessToken === currentUser.accessToken) {
            room.leader = room.members[0];
        }
        socket.leave(room.roomId);
        if (context.rooms.includes(room)) {
            socket.in(room.roomId).emit('roomChanged', room);
        }
    });
    socket.emit('leaveRoomResponse');
}
exports.leaveRoom = leaveRoom;
function startGame(socket, context, currentUser) {
    const room = context.rooms.find(r => r.leader.accessToken === currentUser.accessToken);
    room.colors = roomModel_1.Room.generateRoomColors(room.members.length);
    if (room) {
        room.state = enums_1.RoomState.GameStarted;
        room.members.forEach(u => u.color = room.getColor());
        socket.emit('startGameResponse', true);
        context.io.in(room.roomId).emit('roomChanged', room);
        log_1.log(`Starting game in room ${room.roomId}`);
    }
    else {
        socket.emit('startGameResponse', false);
    }
}
exports.startGame = startGame;

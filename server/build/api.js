"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("./enums");
function createRoom(socket) {
    var currentUser = this.users.find(function (user) { return user.clientId === socket.client.id; });
    var room = {
        leaderId: currentUser.accessToken,
        roomId: this.generateId(),
        members: [currentUser.accessToken],
        isMine: true,
    };
    socket.join(room.roomId);
    this.rooms.push(room);
    socket.emit('create-room-response', room);
    console.log("Room created " + room.roomId);
}
exports.createRoom = createRoom;
function joinRoom(socket, roomId) {
    var currentUser = this.users.find(function (user) { return user.clientId === socket.client.id; });
    var room = this.rooms.find(function (r) { return r.roomId === roomId; });
    console.log('room', this.rooms);
    if (room) {
        room.isMine = (room.leaderId === currentUser.accessToken);
        room.members.push(currentUser.accessToken);
        socket.join(room.roomId);
        var state = {
            user: currentUser.accessToken,
            state: enums_1.UserState.Connected,
            newMembers: room.members,
        };
        socket.in(room.roomId).emit('member-state-changed', state);
        socket.emit('join-room-response', room);
        console.log("User joined room " + room.roomId);
    }
    else {
        socket.emit('join-room-response', undefined);
        console.log("Joining room failed " + roomId);
    }
}
exports.joinRoom = joinRoom;
function handshake(socket, accessToken) {
    this.users.push({
        accessToken: accessToken,
        clientId: socket.client.id,
    });
    console.log('Handshake', accessToken);
    this.rooms
        .filter(function (room) { return room.members.some(function (member) { return member === accessToken; }); })
        .forEach(function (room) {
        socket.in(room.roomId).emit('member-state-changed', {
            user: accessToken,
            state: enums_1.UserState.Connected,
            newMembers: room.members,
        });
        console.log('Sending connection message');
    });
    socket.emit('handshake-response', accessToken);
}
exports.handshake = handshake;
function getCurrentRoom(socket) {
    var currentUser = this.users.find(function (user) { return user.clientId === socket.client.id; });
    var room = this.rooms.find(function (r) { return r.members.indexOf(currentUser.accessToken) > -1; });
    if (room) {
        console.log("Current room request " + room.roomId);
        socket.emit('get-current-room-response', room);
    }
    else {
        console.log("Current room request (Not in a room)");
        socket.emit('get-current-room-response', undefined);
    }
}
exports.getCurrentRoom = getCurrentRoom;

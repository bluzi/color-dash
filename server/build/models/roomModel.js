"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    static generateId(rooms) {
        let id = '';
        do {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for (let i = 0; i < 3; i++) {
                id += possible.charAt(Math.floor(Math.random() * possible.length));
            }
        } while (rooms.some(room => room.roomId === id));
        return id;
    }
    static generateRoomColors(membersCount) {
        return ['red', 'green', 'blue', 'purple', 'pink', 'orange']
            .slice(0, membersCount - 1);
    }
    constructor(leader, rooms) {
        this.leader = leader;
        this.roomId = Room.generateId(rooms);
        this.members = [leader];
        this.state = RoomState.WaitingForPlayers;
    }
    getColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
}
exports.Room = Room;
var RoomState;
(function (RoomState) {
    RoomState[RoomState["WaitingForPlayers"] = 0] = "WaitingForPlayers";
    RoomState[RoomState["GameStarted"] = 1] = "GameStarted";
})(RoomState = exports.RoomState || (exports.RoomState = {}));

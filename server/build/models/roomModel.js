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
        return ['#E06577', '#6FA545', '#00659D', '#B35E7F', '#FC8990', '#0E0E0E']
            .slice(0, membersCount - 1);
    }
    constructor(leader, rooms) {
        this.leader = leader;
        this.roomId = Room.generateId(rooms);
        this.members = [leader];
        this.state = RoomState.WaitingForPlayers;
    }
    getColor(not) {
        let color;
        do {
            color = this.colors[Math.floor(Math.random() * this.colors.length)];
        } while (color === not);
        return color;
    }
}
exports.Room = Room;
var RoomState;
(function (RoomState) {
    RoomState[RoomState["WaitingForPlayers"] = 0] = "WaitingForPlayers";
    RoomState[RoomState["GameStarted"] = 1] = "GameStarted";
    RoomState[RoomState["Finished"] = 2] = "Finished";
})(RoomState = exports.RoomState || (exports.RoomState = {}));

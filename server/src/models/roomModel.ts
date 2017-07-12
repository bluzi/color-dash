import { User } from './userModel';

export class Room {
    roomId: string;
    leader: User;
    members: User[];
    state: RoomState;
    colors?: string[];

    private static generateId(rooms: Room[]) {
        let id = '';
        do {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

            for (let i = 0; i < 3; i++) {
                id += possible.charAt(Math.floor(Math.random() * possible.length));
            }
        } while (rooms.some(room => room.roomId === id));

        return id;
    }

    static generateRoomColors(membersCount: number) {
        return ['red', 'green', 'blue', 'purple', 'pink', 'orange']
                .slice(0, membersCount - 1);
    }

    constructor(leader: User, rooms: Room[]) {
        this.leader = leader;
        this.roomId = Room.generateId(rooms);
        this.members = [leader];
        this.state = RoomState.WaitingForPlayers;
    }

    getColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
}

export enum RoomState {
    WaitingForPlayers,
    GameStarted
}

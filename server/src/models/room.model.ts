import { User } from './user.model';

export class Room {
    roomId: string;
    leader: User;
    members: User[];
    state: RoomState;
    colors?: string[];
    winner?: string;

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
        return ['#E06577', '#6FA545', '#00659D', '#B35E7F', '#FC8990', '#0E0E0E']
                .slice(0, membersCount - 1);
    }

    constructor(leader: User, rooms: Room[]) {
        this.leader = leader;
        this.roomId = Room.generateId(rooms);
        this.members = [leader];
        this.state = RoomState.WaitingForPlayers;
    }

    getColorExcept(not?: string) {
        let color: string;
        
        do {
            color = this.getColor();
        } while (color === not);

        return color;
    }

    getColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
}

export enum RoomState {
    WaitingForPlayers,
    GameStarted,
    Finished
}

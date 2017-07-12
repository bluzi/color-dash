import { User } from './user.model';

export class Room {
    roomId: string;
    leader: User;
    members: User[];
    state: RoomState;
}

export enum RoomState {
    WaitingForPlayers,
    GameStarted
}

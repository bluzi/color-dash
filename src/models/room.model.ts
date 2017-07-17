import { User } from './user.model';

export class Room {
    roomId: string;
    leader: User;
    members: User[];
    state: RoomState;
    winner?: string; 
}

export enum RoomState {
    WaitingForPlayers,
    GameStarted,
    Finished
}

export class Room {
    roomId: string;
    leaderId: string;
    members: string[];
    state: RoomState;
}

export enum RoomState {
    WaitingForPlayers,
    GameStarted
}

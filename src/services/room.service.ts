import { Injectable } from '@angular/core';
import { Room } from '../models/room.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { SocketService } from 'services/socket.service';


@Injectable()
export class RoomService {

    constructor(private socket: SocketService) { }

    getCurrentRoom(): Promise<Room> {
        return this.socket.emit('getCurrentRoom')
            .once<Room>('get-current-room-response');
    }

    create(): Promise<Room> {
        return this.socket.emit('createRoom')
            .once<Room>('createRoomResponse');
    }

    join(roomId: string): Promise<Room> {
        return this.socket.emit('joinRoom', roomId)
            .once<Room>('joinRoomResponse');
    }

    leave(): Promise<void> {
        return this.socket.emit('leaveRoom')
            .once<void>('leaveRoomResponse');
    }

    listenToRoom(): Observable<Room> {
        return this.socket.on('roomChanged');
    }

    startGame(): Promise<boolean> {
        return this.socket.emit('startGame')
            .once<boolean>('startGameResponse');
    }
}

import { User } from './../../server/src/models/userModel';
import { Observable } from 'rxjs/Observable';
import { SocketService } from './socket.service';
import { Injectable } from '@angular/core';

@Injectable()
export class GameService {
    constructor(private socket: SocketService) { }

    press(user: User): Promise<void> {
        return this.socket.emit('press', user.accessToken)
            .once<void>('pressResponse');
    }

    stopPressing(): Promise<void> {
        return this.socket.emit('stopPressing')
            .once<void>('stopPressingResponse');
    }

    listenToColor(): Observable<string> {
        return this.socket.on('colorChanged');
    }

    getColor(): Promise<string> {
        return this.socket.emit('getColor')
            .once<string>('getColorResponse');
    }
}

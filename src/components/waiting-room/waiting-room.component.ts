import { GameComponent } from './../game/game.component';
import { AuthService } from './../../services/auth.service';
import { HomeComponent } from 'components/home/home.component';
import { RoomService } from './../../services/room.service';
import { Observable } from 'rxjs/Observable';
import { Room } from './../../models/room.model';
import { Component, OnInit } from '@angular/core';
import { UserState } from '../../models/member-state-change.model';
import { SocketService } from 'services/socket.service';
import { NavigationService } from '../../services/navigation.service';
import { RoomState } from '../../models/room.model';

@Component({
    selector: 'app-waiting-room',
    templateUrl: 'waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss']
})
export class WaitingRoomComponent implements OnInit {
    room: Room;
    isMine: boolean;

    constructor(private socketService: SocketService, private roomService: RoomService,
        private navigation: NavigationService, private auth: AuthService) {
        this.roomService.listenToRoom().subscribe(room => (this.room = room, this.refresh()));
    }

    ngOnInit(): void {
        this.refresh();
    }

    private refresh() {
        this.isMine = this.room.leaderId === this.auth.accessToken;

        if (this.room.state === RoomState.GameStarted) {
            this.navigation.navigateTo(GameComponent);
        }
    }

    startGame() {
        this.roomService.startGame();
    }

    async leave() {
        await this.roomService.leave();
        this.navigation.navigateTo(HomeComponent);
    }
}

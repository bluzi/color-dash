import { AuthService } from './../../services/auth.service';
import { HomeComponent } from 'components/home/home.component';
import { GameService } from 'services/game.service';
import { Component, HostBinding } from '@angular/core';
import { RoomService } from './../../services/room.service';
import { NavigationService } from '../../services/navigation.service';
import { Room } from '../../models/room.model';
import { User } from '../../../server/src/models/userModel';


@Component({
    selector: 'app-game',
    templateUrl: 'game.component.html',
    styleUrls: ['game.component.scss'],
})
export class GameComponent {
    @HostBinding('style.backgroundColor') color;
    private room: Room;
    private pressing: User;

    get members() {
        return this.room.members.filter(member => member.accessToken !== this.authService.accessToken);
    }

    constructor(private roomService: RoomService, private navigation: NavigationService, private gameService: GameService,
                private authService: AuthService) {
        this.roomService.getCurrentRoom().then(room => this.room = room);
        this.gameService.getColor().then(color => this.color = color);
        this.gameService.listenToColor().subscribe(color => {
            this.color = color;
            this.pressing = null;
        });
        this.roomService.listenToRoom().subscribe(room => (this.room = room, this.refresh()));
    }

    refresh() {
    }

    press(user) {
        if (!this.pressing) {
            this.pressing = user;
            this.gameService.press(user);
            setTimeout(() => {
                this.gameService.stopPressing();
                this.pressing = undefined;
            }, 3000);
        }
    }

    async leave() {
        await this.roomService.leave();
        this.navigation.navigateTo(HomeComponent);
    }
}

import { AuthService } from './../../services/auth.service';
import { HomeComponent } from 'components/home/home.component';
import { GameService } from 'services/game.service';
import { Component, HostBinding } from '@angular/core';
import { RoomService } from './../../services/room.service';
import { NavigationService } from '../../services/navigation.service';
import { Room } from '../../models/room.model';
import { User } from '../../models/user.model';


@Component({
    selector: 'app-game',
    templateUrl: 'game.component.html',
    styleUrls: ['game.component.scss'],
})
export class GameComponent {
    @HostBinding('style.backgroundColor') backgroundColor;
    private timerHandle: any;
    private color: string;
    private room: Room;
    private pressing: User;
    private players: User[];

    constructor(private roomService: RoomService, private navigation: NavigationService, private gameService: GameService,
                private authService: AuthService) {
        this.roomService.getCurrentRoom().then(room => (this.room = room, this.refresh()));
        this.gameService.getColor().then(color => {
            this.color = color;
            this.restartTimer();
        });
        
        this.gameService.listenToColor().subscribe(color => {
            this.pressing = null;            
            this.color = color;
            this.restartTimer();
        });

        this.roomService.listenToRoom().subscribe(room => (this.room = room, this.refresh()));

                
    }

    restartTimer() {
        this.killTimer();

        this.blink();
        this.timerHandle = setInterval(() => this.blink(), 5000);
    }

    killTimer() {
        clearInterval(this.timerHandle);
        this.timerHandle = undefined;
        this.backgroundColor = undefined;
    }

    blink() {
        if (this.color) {
            this.backgroundColor = this.color;
            setTimeout(() => this.backgroundColor = undefined, 1000);
        }
    }

    refresh() {
        this.players = this.room.members.filter(member => member.accessToken !== this.authService.accessToken);

        if (this.room.winner) {
            this.color = undefined;
            this.killTimer();
        }
    }

    async press(user) {
        if (!this.pressing) {
            this.pressing = user;
            await this.gameService.press(user);
            this.pressing = undefined;
        }
    }

    async leave() {
        await this.roomService.leave();
        this.navigation.navigateTo(HomeComponent);
    }
}

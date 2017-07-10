import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-game',
    templateUrl: 'game.component.html',
    styleUrls: ['game.component.scss'],
})
export class GameComponent {
    @HostBinding('style.backgroundColor') background = 'blue';
}

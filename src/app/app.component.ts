import { RoomService } from 'services/room.service';
import { NavigationService } from './../services/navigation.service';
import { HomeComponent } from 'components/home/home.component';
import { Component, Type, OnInit, ViewEncapsulation } from '@angular/core';
import { SocketService } from 'services/socket.service';
import { WaitingRoomComponent } from '../components/waiting-room/waiting-room.component';
import { NavigationRequest } from '../services/navigation.service';
import { GameComponent } from '../components/game/game.component';

@Component({
  selector: 'app-root',
  template: '<app-placeholder [component]="currentPage"></app-placeholder>',
  encapsulation: ViewEncapsulation.None,
  styles: [
    '@import url("https://fonts.googleapis.com/css?family=Roboto");',
    'html, body { margin: 0; height: 100%; font-family: "Roboto" }',
    '.sticky-footer { position: absolute; bottom: 10px; text-align: center; width: 100%; }'
  ]
})
export class AppComponent implements OnInit {
  currentPage: NavigationRequest;

  constructor(private socketService: SocketService, private navigation: NavigationService,
              private roomService: RoomService) { }

  async ngOnInit() {
    await this.socketService.performHandshake();

    this.navigation.getCurrentPage().subscribe(page => setTimeout(() => this.currentPage = page));

    const currentRoom = await this.roomService.getCurrentRoom();

    if (currentRoom) {
      this.navigation.navigateTo(WaitingRoomComponent, {
        room: currentRoom
      });
    } else {
      this.navigation.navigateTo(HomeComponent);
    }
  }
}

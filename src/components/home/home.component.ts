import { Component } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { WaitingRoomComponent } from '../waiting-room/waiting-room.component';
import { AuthService } from 'services/auth.service';
import { SocketService } from 'services/socket.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styles: [
    ':host { text-align: center; padding: 10px; }',
    'h2 { margin-bottom: 40px; opacity: 0.3; }',
    '.or { @extend .is-unselectable; font-size: 1.5em; display: inline-block; margin-right: 10px; opacity: 0.4; }',
    '.field { margin: 10px; }',
    '.field input { text-transform: uppercase; }',
  ],
})
export class HomeComponent {

  user;
  enteredRoomId = '';

  constructor(private auth: AuthService, private roomService: RoomService,
              private socketService: SocketService, private navigation: NavigationService) {
    this.user = this.auth.currentUser;
  }

  async createRoom() {
    try {
      const room = await this.roomService.create();
      this.navigation.navigateTo(WaitingRoomComponent, {
        room
      })
    } catch (error) {
      alert('Could not find room');
    }
  }

  async joinRoom() {
    if (this.enteredRoomId) {
      const room = await this.roomService.join(this.enteredRoomId);
      if (room) {
        this.navigation.navigateTo(WaitingRoomComponent, {
          room
        });
      } else {
        alert('Could not find room');
      }
    }
  }

}

import { Component } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { WaitingRoomComponent } from '../waiting-room/waiting-room.component';
import { AuthService } from 'services/auth.service';
import { SocketService } from 'services/socket.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html'
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

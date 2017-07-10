import { GameComponent } from './../components/game/game.component';
import { NavigationService } from './../services/navigation.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FacebookModule } from 'ngx-facebook';

import { AppComponent } from './app.component';
import { WaitingRoomComponent } from 'components/waiting-room/waiting-room.component';
import { HomeComponent } from 'components/home/home.component';
import { AuthService } from 'services/auth.service';
import { GameService } from 'services/game.service';
import { RoomService } from 'services/room.service';
import { SocketService } from 'services/socket.service';
import { PlaceholderComponent } from '../components/placeholder/placeholder.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaceholderComponent,
    HomeComponent,
    WaitingRoomComponent,
    GameComponent,
  ],
  entryComponents: [
    HomeComponent,
    WaitingRoomComponent,
    GameComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,

    FacebookModule.forRoot(),
  ],
  providers: [
    NavigationService,
    SocketService,
    AuthService,
    GameService,
    RoomService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

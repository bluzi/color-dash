import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import * as socketIo from 'socket.io-client';
import { AuthService } from 'services/auth.service';

@Injectable()
export class SocketService {

  private socket: SocketIOClient.Socket;

  constructor(private auth: AuthService) { }

  async performHandshake(): Promise<void> {
    const socket = socketIo('http://localhost:8080');
    const user = await this.auth.login();

    socket.emit('handshake', this.auth.accessToken);

    return new Promise<void>((resolve, reject) => {
      socket.once('handshake-response', () => {
        this.socket = socket;
        console.log('Handshake made succesfuly');
        resolve();
      })
    });
  }

  private get() {
    if (!this.socket) {
      throw new Error('Socket operation has been executed before handshake resolved.');
    }

    return this.socket;
  }

  emit(event: string, ...args: any[]) {
    this.get().emit(event, ...args);
    return this;
  }

  once<T>(event: string): Promise<T> {
    return new Promise<T>((resolve, reject) => this.get().once(event, resolve));
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>(subscriber => {
      this.get().on(event, data => subscriber.next(data));
    });
  }
}

import { Injectable } from '@angular/core';
import * as socketIO from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Message, SocketEvent } from './models/chat';

const SERVER_URL = 'wss://localhost:3000';


@Injectable()
export class SocketService {
  socket: SocketIOClient.Socket;

  constructor() {

  }

  connect() {
    this.socket = socketIO.connect(SERVER_URL, { transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']});
  }

  disconnect() {
    this.socket.close();
  }

  emit(to: string, data: any) {
    this.socket.emit(to, data);
  }

  onEvent(event: SocketEvent): Observable<any> {
    return new Observable<SocketEvent>(observer => {
      this.socket.on(event, (data) => observer.next(data));
    });
  }

}

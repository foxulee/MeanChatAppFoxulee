import * as socketIO from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { BACKEND_URI } from './config/backend-uri';

@Injectable()
export class NotificationService {
  private socket: SocketIOClient.Socket;
  
  constructor(private http: HttpClient, private socketService: SocketService) {
    this.socket = socketService.socket
  }

  getLoginUserInfo(userId: string) {
    return this.http.get(BACKEND_URI + 'api/group/getUser/' + userId);
  }

}

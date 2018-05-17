import { Injectable, group } from '@angular/core';
import * as socketIO from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from './models/chat';
import { SocketService } from './socket.service';
import { AuthenticationService } from './authentication.service';


@Injectable()
export class FriendRequestService {

  private socket: SocketIOClient.Socket;

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) { }

  getFriendList(userId) {
    return this.http.get('api/group/getFriendList/' + userId);
  }

  sendFriendRequest(sender: User, receiver: string, group: string) {
    return this.http.post('api/group/friendRequest/' + group, { sender, receiver });
  }

  accetpFriendRequest(senderId: string, senderName: string, ) {
    let currentUser = this.auth.getUserDetails();
    let userId = currentUser._id;
    let userName = currentUser.name;

    return this.http.post('api/group/request/accept', { senderId, senderName, userId, userName });
  }

  cancelFriendRequest(senderId: string, senderName: string, ) {
    let currentUser = this.auth.getUserDetails();
    let userId = currentUser._id;
    let userName = currentUser.name;

    return this.http.post('api/group/request/cancel', { senderId, senderName, userId, userName });
  }
}

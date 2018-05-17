import { Injectable } from '@angular/core';
import * as socketIO from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Message, SocketEvent } from './models/chat';
import { SocketService } from './socket.service';
import { HttpClient } from '@angular/common/http';


// const SERVER_URL = 'http://localhost:3000'; 

@Injectable()
export class GroupChatService {
  private socket: SocketIOClient.Socket;

  constructor(private socketService: SocketService, private http: HttpClient) { this.socket = socketService.socket }

  // initSocket() {
  //   this.socket = socketIO.connect(SERVER_URL, { transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling'] });
  // }

  // oinGroup(group: string, name: string, userId: string, image: string) {
  //   this.socket.emit('join', { group, name, userId, image });
  // }j

  send(message: Message): void {
    this.http.post('api/group/saveGroupMessage', message).subscribe();
  }

  getAllGroupMessages(group: string) {
    return this.http.get('api/group/getAllGroupMessages/' + group)
      .map(messages => (messages as Array<any>).map(message => { 
        // console.log('message',message);
        return { from: { id: message.senderId._id, name: message.senderName, image: message.senderId.userImage }, content: message.message } }));;
  }

  // onUsersList(): Observable<any[]> {
  //   return new Observable<string[]>(observer => {
  //     this.socket.on('usersList', (data: any[]) => observer.next(data));
  //   })
  // }

  // onMessage(): Observable<Message> {
  //   return new Observable<Message>(observer => {
  //     this.socket.on('message', (data: Message) => observer.next(data));
  //   });
  // }

  // onEvent(event: SocketEvent): Observable<any> {
  //   return new Observable<SocketEvent>(observer => {
  //     this.socket.on(event, () => observer.next());
  //   });
  // }
}

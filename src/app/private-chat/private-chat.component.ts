import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { Component, OnInit, ViewChildren, ViewChild, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import {
  Message,
  PrivateMessage,
  SocketEvent,
  User
} from '../models/chat';
import { Observable } from 'rxjs/Observable';
import { PrivateChatService } from '../private-chat.service';
import { SocketService } from '../socket.service';
import { FriendRequestService } from '../friend-request.service';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.css']
})
export class PrivateChatComponent implements OnInit, AfterViewInit {


  user: User = new User('');
  messages: Message[] = [];
  messageContent: string;
  group;
  onlineFriendsList: any[] = [];
  receiverName: string;
  receiverId: string;
  senderImage: string;
  isOnline: boolean = false;

  @ViewChildren('messageList') messageList: QueryList<Message>;

  @ViewChild('messageDiv') messageDiv: ElementRef;

  get message(): Message {
    return {
      from: this.user,
      content: this.messageContent.trim(),
      group: this.group
    }
  }

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    public auth: AuthenticationService,
    private http: HttpClient,
    private privateChatService: PrivateChatService,
    private friendRequestService: FriendRequestService
  ) {
    let details = this.auth.getUserDetails();
    this.user.name = details.name;
    this.user.id = details._id;
    this.user.mantra = details.mantra;
    this.user.image = details.img;
    this.senderImage = details.img;
    this.socketService.connect();
  }

  ngOnInit() {
    this.receiverName = this.route.snapshot.queryParams['receiverName'];

    let room1 = this.route.snapshot.params['id'];
    this.group = room1;
    let arr = room1.split('.');
    this.receiverId = arr[0];
    let room2 = arr[1] + '.' + arr[0];

    // this.socket.on('connect', () => {
    // friend list
    let userDetails = this.auth.getUserDetails();
    let group = 'GlobalGroup';
    let name = userDetails.name;
    let img = userDetails.img;
    let id = userDetails._id;

    this.socketService.onEvent(SocketEvent.CONNECT)
      .subscribe(() => {
        this.isOnline = true;
      });

    this.socketService.onEvent(SocketEvent.DISCONNECT)
      .subscribe(() => {
        this.isOnline = false;
      });

    this.socketService.emit('global group', { group, name, img, id });

    this.socketService.onEvent(SocketEvent.ONLINE_FRIENDS).subscribe(onlineUsers => {
      this.friendRequestService.getFriendList(this.user.id).subscribe(friendList => {
        this.onlineFriendsList = [];
        onlineUsers.forEach(user => {
          for (let friend of friendList as Array<any>) {
            if (friend.id == user.id) {
              this.onlineFriendsList.push(user);
              break;
            }
          }
        });
      })
    });

    this.privateChatService.getAllPrivateMessages(this.user.id, this.receiverId).subscribe(messages => {
      // console.log(messages);
      this.messages = messages as Array<any>
    });

    this.socketService.emit('private-room', { room1, room2 });

    this.socketService.onEvent(SocketEvent.PRIVATE_MESSAGE_RECEIVE).subscribe(message => this.messages.push(message));
    // });

  }

  sendMessage() {
    // save to the database
    let privateMessage: PrivateMessage = { from: this.user, to: { id: this.receiverId, name: this.receiverName }, group: this.group, content: this.messageContent, senderImage: this.senderImage };
    this.privateChatService.sendMessage(privateMessage);
    // directly send to friend
    this.socketService.emit('private message send', this.message);
    this.messageContent = '';
  }

  navigateToMyProfile() {
    window.open('/setting/profile')
  }

  ngAfterViewInit(): void {
    this.messageList.changes.subscribe(() => {
      this.scrollToBottom()
    });
  }

  scrollToBottom() {
    try { this.messageDiv.nativeElement.scrollTop = this.messageDiv.nativeElement.scrollHeight; }
    catch (err) { }
  }

}

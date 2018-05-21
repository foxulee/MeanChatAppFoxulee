import { Component, OnInit, OnDestroy, ViewChildren, ViewChild, ElementRef, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, Action, User, SocketEvent } from '../models/chat';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../authentication.service';
import { FriendRequestService } from '../friend-request.service';
import { SocketService } from './../socket.service';
import { GroupChatService } from '../group-chat.service';
import { UserDetails } from './../authentication.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import 'rxjs/add/operator/take';
import { ReloadNavbarService } from '../reload-navbar.service';


@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})
export class GroupChatComponent implements OnInit, OnDestroy {
  groupName: string;
  action = Action;
  user: User = new User('');
  onlineUsersList: any[] = [];
  messages: Message[] = [];
  messageContent: string;
  ioConnection: Subscription;
  receiverName: string = "";
  receiverId: string = "";

  isHidden: false;

  username: string;
  isOnline: boolean = false;

  onlineFriendsList: any[] = [];

  @ViewChildren('messageList') messageList: QueryList<Message>;
  @ViewChild('messageDiv') messageDiv: ElementRef;

  get message(): Message {
    return {
      from: this.user,
      content: this.messageContent,
      group: this.groupName
    }
  }

  constructor(
    private route: ActivatedRoute,
    private groupChatService: GroupChatService,
    public auth: AuthenticationService,
    private friendRequestService: FriendRequestService,
    private socketService: SocketService,
    private router: Router,
    private reloadNavbarService: ReloadNavbarService
  ) {
  }

  ngOnInit() {
    this.groupName = this.route.snapshot.params['name'];
    let userDetails = this.auth.getUserDetails();
    this.username = this.user.name = userDetails.name;
    this.user.id = userDetails._id;
    this.user.image = userDetails.img;
    this.user.mantra = userDetails.mantra;

    this.groupChatService.getAllGroupMessages(this.groupName).subscribe(messages => {
      // console.log(messages)
      this.messages = messages;
    })

    this.initIoConnection();

    this.reloadNavbarService.reloadNavbar();

    // friend list
    let group = 'GlobalGroup';
    let name = userDetails.name;
    let img = userDetails.img;
    let id = userDetails._id;

    this.socketService.emit('global group', { group, name, img, id });

    // get online friend list
    this.socketService.onEvent(SocketEvent.ONLINE_FRIENDS).subscribe(onlineUsers => {
      this.friendRequestService.getFriendList(this.user.id).subscribe(friendList => {
        // console.log('onlineUsers', onlineUsers);
        // console.log('friendList', friendList);
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
  }


  ngOnDestroy() {
    this.socketService.emit('leave group', {});
    this.ioConnection.unsubscribe();
  }

  private initIoConnection(): void {

    this.socketService.emit('joinNotificationList', this.user.name);

    this.ioConnection = this.socketService.onEvent(SocketEvent.GROUP_MESSAGE)
      .subscribe((message: Message) => {
        // console.log(message);
        this.messages.push(message);
      });

    // this.socketService.onEvent(SocketEvent.CONNECT)
    //   .subscribe(() => {
        console.log('connected');

        // join group chat
        this.socketService.emit('join', { group: this.groupName, name: this.user.name, userId: this.user.id, image: this.user.image });
        this.isOnline = true;

        // join friend request notification
        this.socketService.emit('joinRequest', { sender: this.user, receiver: this.receiverName });

      // });

    this.socketService.onEvent(SocketEvent.JOIN).subscribe(() => {
      console.log('User has joined this channel');
    })


    this.socketService.onEvent(SocketEvent.ONLINE_GROUP_USERS).subscribe(usersList => {
      // console.log(usersList);
      // let self appears at the first place
      let newUserList = [];
      usersList.forEach(user => {
        if (user.id === this.user.id) newUserList.push(user)
      });
      usersList.forEach(user => {
        if (user.id !== this.user.id) newUserList.push(user)
      });
      this.onlineUsersList = newUserList;
    });

    this.socketService.onEvent(SocketEvent.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
        this.isOnline = false;
      });


    this.socketService.onEvent(SocketEvent.FRIEND_REQUEST_SEND).subscribe(console.log);


    this.socketService.onEvent(SocketEvent.FRIEND_REQUEST_RECEIVE).subscribe((data) => {
      console.log(data);
    });

  }

  sendMessage(): void {
    if (!this.messageContent) {
      return;
    }

    this.socketService.emit(SocketEvent.GROUP_MESSAGE, this.message);
    this.groupChatService.send(this.message);
    this.messageContent = null;
  }

  sendFriendRequest() {
    this.socketService.emit('friendRequest send', { receiver: this.receiverName, sender: this.user });
    this.friendRequestService.sendFriendRequest(this.user, this.receiverName, this.groupName).subscribe();
  }

  navigateToOverview(receiverId: string) {
    // this.router.navigate(['/overview', receiverId]);
    window.open('/#/overview/' + receiverId);
  }

  navigateToMyProfile() {
    window.open('/#/setting/profile')
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


  // sendNotification(params: any, action: Action): void {
  //   let message: Message;

  //   if (action === Action.JOINED) {
  //     message = {
  //       from: this.user,
  //       action: action
  //     }
  //   } else if (action === Action.RENAME) {
  //     message = {
  //       action: action,
  //       content: {
  //         username: this.user.name,
  //         previousUsername: params.previousUsername
  //       }
  //     };
  //   }

  //   this.chatService.send(message);
  // }

}

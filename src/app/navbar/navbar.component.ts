import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { NotificationService } from '../notification.service';
import { FriendRequestService } from '../friend-request.service';
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../socket.service';
import { Observable } from 'rxjs/Observable';
import { Router, NavigationEnd } from '@angular/router';
import { SocketEvent } from '../models/chat';
import { PrivateChatService } from '../private-chat.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  totalFriendRequests: number;
  requestSenders: any[];
  sub1: Subscription;
  sub2: Subscription;
  newMessages: any[] = [];
  unreadCount = 0;
  url: string;
  userDetails: UserDetails;


  constructor(
    public auth: AuthenticationService,
    private notificationService: NotificationService,
    private friendRequestService: FriendRequestService,
    private socketService: SocketService,
    private router: Router,
    private privateChatService: PrivateChatService
  ) {
    this.userDetails = this.auth.getUserDetails();
    if (this.userDetails) {
      this.socketService.connect();
      router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.url = event.url;
          // if not in the chat pages, emit join global group
          if (this.url.indexOf('chat') < 0) {

            let group = 'GlobalGroup';
            let name = this.userDetails.name;
            let img = this.userDetails.img;
            let id = this.userDetails._id;

            this.socketService.emit('global group', { group, name, img, id });
          }
        }
      })
    }
  }

  ngOnInit() {
    if (this.userDetails) {
      this.sub1 = this.notificationService.getLoginUserInfo(this.userDetails._id).subscribe(user => {
        this.totalFriendRequests = user['totalRequest'];
        this.requestSenders = user['request'];
        // console.log('requestSenders', this.requestSenders);
      })

      this.sub2 = this.socketService.onEvent(SocketEvent.FRIEND_REQUEST_RECEIVE)
        .switchMap(() => this.notificationService.getLoginUserInfo(this.userDetails._id))
        .subscribe(user => {
          this.totalFriendRequests = user['totalRequest'];
          this.requestSenders = user['request'];
          // console.log('requestSenders', this.requestSenders);
        });

      this.loadUnreadMessages();

      this.socketService.onEvent(SocketEvent.PRIVATE_MESSAGE_NOTIFICATION).subscribe(() => {
        this.loadUnreadMessages();
      });


      this.socketService.emit('joinNotificationList', this.userDetails.name);
    }
  }

  loadUnreadMessages() {
    this.unreadCount = 0;
    if (this.auth.getUserDetails()) {
      this.privateChatService.loadUnreadMessages(this.auth.getUserDetails()._id)
        .subscribe(latestMessages => {
          if (latestMessages && this.url && this.url.split('/')[2]) {
            // console.log('latestMsgs', latestMessages);
            // console.log('url', this.url);

            let ids = this.url.split('/')[2].split('?')[0].split('.');
            let receiverId = ids[1];
            let senderId = ids[0];

            latestMessages.forEach(msg => {
              if (!msg.isRead) {
                if (msg.receiverId === receiverId && msg.senderId === senderId) {
                  this.changeReadStatus(msg._id).subscribe(() => console.log('yes'));
                }
                else {
                  this.unreadCount = this.unreadCount + 1;
                }
              }
            });
          }
          else {
            latestMessages.forEach(msg => {
              if (!msg.isRead) {
                this.unreadCount = this.unreadCount + 1;
              }
            });
          }

          this.newMessages = this.reorder(latestMessages);
          // console.log('newMsgs', this.newMessages);
          // console.log('count', this.unreadCount);
        });
    }
  }

  private reorder(latestMessages) {
    let newMessages = [];
    latestMessages.forEach(msg => {
      if (!msg.isRead)
        newMessages.push(msg);
    });
    latestMessages.forEach(msg => {
      if (msg.isRead)
        newMessages.push(msg);
    });
    return newMessages;
  }

  readLastMessage(lastUnreadMsg: any) {
    this.changeReadStatus(lastUnreadMsg._id).subscribe(() => {

      // force reload, then trigger the ngOnInit life hook again
      window.location.href = 'private-chat/' + lastUnreadMsg.senderId + '.' + lastUnreadMsg.receiverId + '?receiverName=' + lastUnreadMsg.senderName;
    });
  }

  changeReadStatus(lastUnreadMsgId: string) {
    return this.privateChatService.changeReadStatus(lastUnreadMsgId);
  }

  acceptFriendRequest(senderId: string, senderName: string) {
    this.friendRequestService.accetpFriendRequest(senderId, senderName).subscribe(() => {
      this.updateRequestSenders(senderId);
      this.socketService.emit('global group', { group: 'GlobalGroup' });
    });
  }

  cancelFriendRequest(senderId: string, senderName: string) {
    this.friendRequestService.cancelFriendRequest(senderId, senderName).subscribe(() => {
      this.updateRequestSenders(senderId);
    })
  }

  updateRequestSenders(senderId: string) {
    for (let i = 0; i < this.requestSenders.length; i++) {
      if (this.requestSenders[i]._Id === senderId) {
        this.requestSenders.splice(i, 1);
        break;
      }
    }
    this.totalFriendRequests--;
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}

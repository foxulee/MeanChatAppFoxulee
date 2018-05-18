import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AppComponent } from './app.component';
import { AuthenticationService } from './authentication.service';
import { AuthGuardService } from './auth-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UploadService } from './admin/upload.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ClubService } from './club.service';
import { ClubListComponent } from './club-list/club-list.component';
import { ClubCardComponent } from './club-card/club-card.component';
import { GroupChatComponent } from './group-chat/group-chat.component';
import { FriendRequestService } from './friend-request.service';
import { NotificationService } from './notification.service';
import { SocketService } from './socket.service';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import { MessageNotificationComponent } from './message-notification/message-notification.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberInfoComponent } from './member-info/member-info.component';
import { InterestComponent } from './interest/interest.component';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { GroupChatService } from './group-chat.service';
import { PrivateChatService } from './private-chat.service';
import { AdminGuardService } from './admin-guard.service';
import { NewsComponent } from './news/news.component';
import { NewsService } from './news.service';


const routes: Routes = [
  { path: '', component: HomeComponent, runGuardsAndResolvers: 'always', },
  { path: 'login', component: LoginComponent },
  { path: 'news', component: NewsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'members', component: MemberListComponent, canActivate: [AuthGuardService] },
  { path: 'overview/:id', component: UserOverviewComponent, canActivate: [AuthGuardService] },
  { path: 'group-chat/:name', component: GroupChatComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardService] },
  { path: 'private-chat/:id', component: PrivateChatComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardService] },
  { path: 'setting/profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'setting/interest', component: InterestComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    NavbarComponent,
    ClubListComponent,
    ClubCardComponent,
    GroupChatComponent,
    PrivateChatComponent,
    MessageNotificationComponent,
    MemberListComponent,
    MemberInfoComponent,
    InterestComponent,
    UserOverviewComponent,
    NewsComponent,
  ],
  imports: [
    BrowserModule,
    AngularFontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload'}),
  ],
  providers: [
    AuthenticationService,
    AuthGuardService,
    AdminGuardService,
    UploadService,
    SocketService,
    ClubService,
    GroupChatService,
    NotificationService,
    FriendRequestService,
    PrivateChatService,
    NewsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

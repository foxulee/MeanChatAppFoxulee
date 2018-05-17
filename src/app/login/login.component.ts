import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  constructor(
    private auth: AuthenticationService, 
    private router: Router,
    private socketService: SocketService
  ) {}

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.socketService.connect();
      // this.router.navigateByUrl('/');
      window.location.href ='/';
    }, (err) => {
      console.error(err);
    }); 
  }
  
}

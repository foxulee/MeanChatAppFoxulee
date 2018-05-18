import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  credentials: TokenPayload = {
    email: '',
    name: '',
    password: ''
  };

  emailUnique: Observable<any>;

  constructor(private auth: AuthenticationService, private router: Router) { }

  register() {
    this.auth.register(this.credentials).subscribe(() => {
      // this.router.navigateByUrl('/');
      window.location.href ='/';
    }, (err) => {
      console.error(err);
    });
  }

  
  isEmailUnique(event) {
    const email: string = event.target.value;
    console.log(email);

    this.emailUnique = this.auth.isEmailRegisterd(email);
  }
}

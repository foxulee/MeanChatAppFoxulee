import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable()
export class AdminGuardService {

  constructor(private auth: AuthenticationService, private router: Router) {}

  canActivate() {
    if (!this.auth.isAdmin()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}

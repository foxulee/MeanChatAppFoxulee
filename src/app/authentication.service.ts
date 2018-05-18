import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SocketService } from './socket.service';
import { BACKEND_URI } from './config/backend-uri';

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
  img: string;
  mantra: string;
  roles: string[];
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router, private socketService: SocketService) { }

  saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  isAdmin(): boolean {
    const user = this.getUserDetails();
    if (!user.roles) return false;
    for (let role of user.roles) {
      if (role == 'admin')
        return true;
    }
    return false;

  }

  private request(method: 'post' | 'get', type: 'login' | 'register' | 'profile', user?: TokenPayload): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`${BACKEND_URI}/api/${type}`, user);
    } else {
      base = this.http.get(`${BACKEND_URI}/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` } });
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  saveProfile(userProfile: any): Observable<any> {
    return this.http.post(BACKEND_URI + '/api/saveProfile', userProfile);
  }

  addInterest(interests: any) {
    return this.http.post(BACKEND_URI + 'api/addInterest', { interests, _id: this.getUserDetails()._id });
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.socketService.disconnect();
    this.router.navigateByUrl('/');
  }

  public isEmailRegisterd(email: string) {
    // return this.request('post', 'isEmailRegistered',{email});
    return this.http.post(BACKEND_URI + '/api/isEmailRegistered', { email });
  }

  private handleError(error: any) {
    console.log(error);
    return Observable.throw(error.json());
    ;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Club } from './models/club';
import * as _ from 'lodash';
import { BACKEND_URI } from './config/backend-uri';

@Injectable()
export class ClubService {

  constructor(private http: HttpClient) { }
  getClubs(): Observable<any> {
    return this.http.get(BACKEND_URI + '/api/home/getClubs').map(res => {
      let allClubs: Club[] = [];
      (res['allClubs'] as Array<object>).forEach(obj => {
        allClubs.push(new Club(obj))
      });

      let countries = res['countries']
      return { allClubs, countries };
    })
  }

  addFavoriteClub(clubId: string, clubName: string, userName: string, userEmail: string) {
    return this.http.post(BACKEND_URI + '/api/home/club', { clubId, clubName, userName, userEmail });
  }
}

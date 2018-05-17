import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Club } from '../models/club';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadClubImage(formData: FormData) {
    let headers = new HttpHeaders();
    headers.delete('Content-Type');
    
    return this.http.post('/api/uploadClubImage', formData, {headers: headers})
  }

  uploadUserImage(formData: FormData){
    let headers = new HttpHeaders();
    headers.delete('Content-Type');

    return this.http.post('/api/uploadUserImage', formData, {headers: headers})
  }

  addClub(club: Club){
    return this.http.post('/api/addClub', club);
  }

  saveUser(user) {
    return this.http.post('/api/saveUser', user);
  }

}

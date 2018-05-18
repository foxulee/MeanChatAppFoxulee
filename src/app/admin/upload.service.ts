import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Club } from '../models/club';
import { BACKEND_URI } from '../config/backend-uri';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadClubImage(formData: FormData) {
    let headers = new HttpHeaders();
    headers.delete('Content-Type');

    return this.http.post(BACKEND_URI + '/api/uploadClubImage', formData, { headers: headers })
  }

  uploadUserImage(formData: FormData) {
    let headers = new HttpHeaders();
    headers.delete('Content-Type');

    return this.http.post(BACKEND_URI + '/api/uploadUserImage', formData, { headers: headers })
  }

  addClub(club: Club) {
    return this.http.post(BACKEND_URI + '/api/addClub', club);
  }

  saveUser(user) {
    return this.http.post(BACKEND_URI + '/api/saveUser', user);
  }

}

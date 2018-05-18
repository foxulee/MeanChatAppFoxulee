import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URI } from '../config/backend-uri';

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.css']
})
export class UserOverviewComponent implements OnInit {
  userId: string;
  details: any;

  constructor(private route: ActivatedRoute, public auth: AuthenticationService, private http: HttpClient) { }

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    this.getUserInfo().subscribe(details => {this.details = details});
  }

  getUserInfo(){
    return this.http.get(BACKEND_URI + '/api/member-overview/' + this.userId);
  }

}

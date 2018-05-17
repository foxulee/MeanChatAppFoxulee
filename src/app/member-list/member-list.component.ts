import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  userList: any[];
  filteredUserList: any[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('api/members').subscribe(userList => this.filteredUserList = this.userList = userList as Array<any>);
  }

  onSearchClick(name: string) {
    if (name)
      this.filteredUserList = this.userList.filter(user => (user.name as string).toLowerCase().includes(name.toLowerCase()));
    else this.filteredUserList = this.userList;
  }

}

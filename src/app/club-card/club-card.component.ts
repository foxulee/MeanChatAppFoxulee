import { Component, OnInit, Input } from '@angular/core';
import { Club } from './../models/club';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { ClubService } from '../club.service';
import * as _ from 'lodash';

@Component({
  selector: 'club-card',
  templateUrl: './club-card.component.html',
  styleUrls: ['./club-card.component.css']
})
export class ClubCardComponent implements OnInit {
  @Input('club') club: Club;
  userDetails: UserDetails;

  constructor(private auth: AuthenticationService, private clubService: ClubService) { }

  ngOnInit() {
    this.userDetails = this.auth.getUserDetails();
  }

  addFavorite(clubId: string, clubName: string) {
    if (this.userDetails) {
      this.clubService.addFavoriteClub(clubId, clubName, this.userDetails.name, this.userDetails.email).subscribe(fan => {
        let fans = this.club.fans;
        let added = false;
        for (let i = 0; i < fans.length; i++) {
          if (fans[i].email === this.userDetails.email)
            added = true;
        }
        if (!added)
          this.club.fans.push({ username: this.userDetails.name, email: this.userDetails.email });
      });
    } else{
      return false;
    }

  }

}

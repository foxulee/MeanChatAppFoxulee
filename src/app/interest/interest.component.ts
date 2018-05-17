import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { UploadService } from '../admin/upload.service';
import { UserDetails } from './../authentication.service';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})
export class InterestComponent implements OnInit {

  details: any;
  favClubs: string[] = [];
  favNationalTeams: string[] = [];
  favPlayers: string[] = [];

  constructor(public auth: AuthenticationService, private uploadService: UploadService) {

  }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
      // console.log(this.details)
    }, (err) => {
      console.error(err);
    });
  }

  onSubmit(favClub?: string, favPlayer?: string, favNationalTeam?: string, ) {
    let interests: any = {};
    if (favClub) interests.favClub = favClub;
    if (favPlayer) interests.favPlayer = favPlayer;
    if (favNationalTeam) interests.favNationalTeam = favNationalTeam;
    // console.log(interests);
    this.auth.addInterest(interests).subscribe(() => {
      this.ngOnInit()
    });
  }

}
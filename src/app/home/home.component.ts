import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClubService } from '../club.service';
import { Observable } from 'rxjs/Observable';
import { Club } from '../models/club';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from '../socket.service';
import { AuthenticationService } from '../authentication.service';
import { UserDetails } from './../authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {


  clubs: Club[] = [];
  filteredClubs: Club[] = []
  countries: string[] = [];
  subscription: Subscription;

  selectedCountry: string;
  searchedName: string = '';

  // private socket: SocketIOClient.Socket;

  constructor(private clubService: ClubService, private route: ActivatedRoute, private auth: AuthenticationService, private socketService: SocketService) {
    let socialToken = route.snapshot.queryParams['token'];
    if (socialToken) {
      // console.log('token', socialToken);
      this.auth.saveToken(socialToken);
      this.socketService.connect();
    }
  }
  ngOnInit() {

    // friend list
    let userDetails = this.auth.getUserDetails();
    if (userDetails) {
      let group = 'GlobalGroup';
      let name = userDetails.name;
      let img = userDetails.img;
      let id = userDetails._id;

      // notify online friends list
      this.socketService.emit('global group', { group, name, img, id });
    }

    this.subscription = this.clubService.getClubs().subscribe(data => {
      this.filteredClubs = this.clubs = data['allClubs'];
      this.countries = data['countries'];
    });
  }

  onClubNameChange(country: string) {
    this.selectedCountry = country;
    this.filter(null, country);

  }

  onSearchClick(name: string) {
    this.searchedName = name;
    this.filter(name);
  }

  private filter(name: string = this.searchedName, country: string = this.selectedCountry) {

    if (name) {
      if (this.selectedCountry)
        this.filteredClubs = this.clubs.filter(club => club.name.toLowerCase().includes(name.toLowerCase()) && club.country === country)
      else
        this.filteredClubs = this.clubs.filter(club => club.name.toLowerCase().includes(name.toLowerCase()));
    }
    else {
      if (this.selectedCountry) {
        this.filteredClubs = this.clubs.filter(club => club.country === country)
      }
      else {
        this.filteredClubs = this.clubs;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}

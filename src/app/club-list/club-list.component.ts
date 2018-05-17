import { Component, OnInit, Input } from '@angular/core';
import { Club } from '../models/club';

@Component({
  selector: 'club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.css']
})
export class ClubListComponent implements OnInit {
  @Input('clubs') clubs: Club[] = [];

  constructor() { }

  ngOnInit() {
  }

}

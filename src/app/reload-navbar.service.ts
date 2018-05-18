import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject'

@Injectable()
export class ReloadNavbarService {

  private reload = new Subject<any>();

  get getReloaded() {
    return this.reload.asObservable();
  }

  constructor() { }

  reloadNavbar() {
    this.reload.next(null);
  }

}

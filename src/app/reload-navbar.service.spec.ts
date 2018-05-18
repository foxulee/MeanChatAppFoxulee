import { TestBed, inject } from '@angular/core/testing';

import { ReloadNavbarService } from './reload-navbar.service';

describe('ReloadNavbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReloadNavbarService]
    });
  });

  it('should be created', inject([ReloadNavbarService], (service: ReloadNavbarService) => {
    expect(service).toBeTruthy();
  }));
});

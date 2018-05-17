import { TestBed, inject } from '@angular/core/testing';

import { FriendRequestService } from './friend-request.service';

describe('FriendRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FriendRequestService]
    });
  });

  it('should be created', inject([FriendRequestService], (service: FriendRequestService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { PrivateChatService } from './private-chat.service';

describe('PrivateChatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrivateChatService]
    });
  });

  it('should be created', inject([PrivateChatService], (service: PrivateChatService) => {
    expect(service).toBeTruthy();
  }));
});

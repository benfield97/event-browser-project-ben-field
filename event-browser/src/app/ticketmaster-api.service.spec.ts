import { TestBed } from '@angular/core/testing';

import { TicketmasterApiService } from './ticketmaster-api.service';

describe('TicketmasterApiService', () => {
  let service: TicketmasterApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketmasterApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

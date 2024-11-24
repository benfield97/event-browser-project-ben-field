import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../environments/environment';
import { SearchEventsParams, TicketmasterApiService } from './ticketmaster-api.service';

describe('TicketmasterApiService', () => {
  let service: TicketmasterApiService;
  let httpMock: HttpTestingController;
  const API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
  const mockResponse = {
    _embedded: { events: [] },
    page: { size: 20, totalElements: 100, totalPages: 5, number: 0 }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TicketmasterApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TicketmasterApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchEvents', () => {
    it('should make GET request with basic parameters', () => {
      const params: SearchEventsParams = {
        location: 'New York',
        startDate: '2024-03-20',
        endDate: '2024-03-21'
      };

      service.searchEvents(params).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(request => 
        request.url === API_URL && 
        request.method === 'GET'
      );

      expect(req.request.params.get('apikey')).toBe(environment.ticketmasterApiKey);
      expect(req.request.params.get('city')).toBe('New York');
      expect(req.request.params.get('startDateTime')).toBe('2024-03-20T00:00:00Z');
      expect(req.request.params.get('endDateTime')).toBe('2024-03-21T23:59:59Z');

      req.flush(mockResponse);
    });

    it('should include optional parameters when provided', () => {
      const params: SearchEventsParams = {
        location: 'Los Angeles',
        startDate: '2024-03-20',
        endDate: '2024-03-21',
        stateCode: 'CA',
        keyword: 'concert',
        classificationName: 'music',
        page: 1,
        size: 30
      };

      service.searchEvents(params).subscribe();

      const req = httpMock.expectOne(request => 
        request.url === API_URL && 
        request.method === 'GET'
      );

      expect(req.request.params.get('city')).toBe('Los Angeles');
      expect(req.request.params.get('stateCode')).toBe('CA');
      expect(req.request.params.get('keyword')).toBe('concert');
      expect(req.request.params.get('classificationName')).toBe('music');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('size')).toBe('30');

      req.flush(mockResponse);
    });

    it('should handle empty location parameter', () => {
      const params: SearchEventsParams = {
        location: '',
        startDate: '2024-03-20',
        endDate: '2024-03-21'
      };

      service.searchEvents(params).subscribe();

      const req = httpMock.expectOne(request => 
        request.url === API_URL && 
        request.method === 'GET'
      );

      expect(req.request.params.has('city')).toBeFalse();

      req.flush(mockResponse);
    });
  });
});

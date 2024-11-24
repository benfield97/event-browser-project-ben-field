import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../environments/environment';
import { TicketmasterApiService } from './ticketmaster-api.service';

/**
 * Test suite for TicketmasterApiService
 * Tests HTTP request formation and response handling
 */
describe('TicketmasterApiService', () => {
  let service: TicketmasterApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TicketmasterApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(TicketmasterApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Basic service instantiation test
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Validates HTTP request parameters for event search
   * Checks if API key, location, dates, and pagination are correctly set
   */
  it('should make HTTP GET request with correct parameters', () => {
    const mockLocation = 'Melbourne';
    const mockStartDate = '2024-11-20';
    const mockEndDate = '2025-03-21';
    const page = 0;
    const size = 50;

    service.searchEvents(mockLocation, mockStartDate, mockEndDate).subscribe();

    // Verify request URL and method
    const req = httpMock.expectOne(request => 
      request.url === 'https://app.ticketmaster.com/discovery/v2/events.json' &&
      request.method === 'GET'
    );

    // Validate query parameters
    expect(req.request.params.get('apikey')).toBe(environment.ticketmasterApiKey);
    expect(req.request.params.get('city')).toBe(mockLocation);
    expect(req.request.params.get('startDateTime')).toBe(`${mockStartDate}T00:00:00Z`);
    expect(req.request.params.get('endDateTime')).toBe(`${mockEndDate}T23:59:59Z`);
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('50');
  });

  /**
   * Tests proper handling of API response
   * Verifies service correctly processes events and pagination data
   */
  it('should handle the response correctly', () => {
    const mockResponse = {
      _embedded: {
        events: [
          { id: '1', name: 'Test Event' }
        ]
      },
      page: {
        size: 50,
        totalElements: 1,
        totalPages: 1,
        number: 0
      }
    };

    service.searchEvents('Melbourne', '2024-11-20', '2025-03-21').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(request => 
      request.url === 'https://app.ticketmaster.com/discovery/v2/events.json'
    );
    req.flush(mockResponse);
  });
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { EventListComponent } from '../event-list/event-list.component';
import { TicketmasterApiService, TicketmasterResponse } from '../ticketmaster-api.service';
import { SearchFormComponent } from './search-form.component';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let ticketmasterServiceSpy: jasmine.SpyObj<TicketmasterApiService>;

  // Mock response for empty state
  const mockEmptyResponse: TicketmasterResponse = {
    _embedded: { events: [] },
    page: {
      size: 50,
      totalElements: 0,
      totalPages: 0,
      number: 0
    }
  };

  // Mock response with event data
  const mockEventResponse: TicketmasterResponse = {
    _embedded: { 
      events: [{ 
        name: "Melbourne Comedy Festival",
        id: "vvG1VZKS5pr2xy",
        dates: {
          start: {
            localDate: "2024-03-27",
            localTime: "19:30:00"
          }
        },
        images: [
          {
            ratio: "16_9",
            url: "https://example.com/melbourne-comedy-festival.jpg",
            width: 1136,
            height: 639,
          }
        ],
        _embedded: {
          venues: [{
            name: "Melbourne Town Hall",
            city: {
              name: "Melbourne"
            },
            state: {
              name: "Victoria"
            }
          }]
        }
      }] 
    },
    page: {
      size: 50,
      totalElements: 1,
      totalPages: 2,
      number: 0
    }
  };

  beforeEach(async () => {
    // Create spy that returns empty response by default
    const spy = jasmine.createSpyObj('TicketmasterApiService', ['searchEvents']);
    spy.searchEvents.and.returnValue(of(mockEmptyResponse));

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        SearchFormComponent,
        EventListComponent
      ],
      providers: [
        { provide: TicketmasterApiService, useValue: spy }
      ]
    }).compileComponents();

    ticketmasterServiceSpy = TestBed.inject(TicketmasterApiService) as jasmine.SpyObj<TicketmasterApiService>;
    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Basic component tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty values', () => {
    expect(component.location).toBe('');
    expect(component.startDate).toBe('');
    expect(component.endDate).toBe('');
    expect(component.events).toEqual([]);
    expect(component.currentPage).toBe(0);
    expect(component.isLoading).toBeFalse();
  });

  // Verify search parameters are correctly passed to API
  it('should call searchEvents on form submit', fakeAsync(() => {
    component.location = 'Melbourne';
    component.startDate = '2024-11-20';
    component.endDate = '2025-03-21';

    component.onSearch();
    tick();

    expect(ticketmasterServiceSpy.searchEvents).toHaveBeenCalledWith(
      'Melbourne',
      '2024-11-20',
      '2025-03-21',
      0,
      50
    );
  }));

  // Test pagination functionality
  it('should handle load more events', fakeAsync(() => {
    component.hasMoreEvents = true;
    component.currentPage = 0;
    component.location = 'Melbourne';
    component.startDate = '2024-11-20';
    component.endDate = '2025-03-21';

    component.loadMore();
    tick();

    expect(ticketmasterServiceSpy.searchEvents).toHaveBeenCalledWith(
      'Melbourne',
      '2024-11-20',
      '2025-03-21',
      1,
      50
    );
  }));

  // Verify pagination stops when no more events
  it('should not load more events when hasMoreEvents is false', fakeAsync(() => {
    component.hasMoreEvents = false;
    component.loadMore();
    tick();

    expect(ticketmasterServiceSpy.searchEvents).not.toHaveBeenCalled();
  }));

  // Test pagination flag updates based on API response
  it('should update hasMoreEvents based on response', fakeAsync(() => {
    ticketmasterServiceSpy.searchEvents.and.returnValue(of(mockEventResponse));

    component.onSearch();
    tick();

    expect(component.hasMoreEvents).toBeTrue();
  }));
});

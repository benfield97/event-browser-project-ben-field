import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EventListComponent } from '../event-list/event-list.component';
import { TicketmasterApiService } from '../ticketmaster-api.service';
import { SearchFormComponent } from './search-form.component';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let apiServiceSpy: jasmine.SpyObj<TicketmasterApiService>;

  const mockResponse = {
    _embedded: {
      events: [
        { id: '1', name: 'Event 1' },
        { id: '2', name: 'Event 2' }
      ]
    },
    page: {
      size: 50,
      totalElements: 2,
      totalPages: 1,
      number: 0
    }
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TicketmasterApiService', ['searchEvents']);
    spy.searchEvents.and.returnValue(of(mockResponse));

    await TestBed.configureTestingModule({
      imports: [FormsModule, SearchFormComponent, EventListComponent],
      providers: [
        { provide: TicketmasterApiService, useValue: spy }
      ]
    }).compileComponents();

    apiServiceSpy = TestBed.inject(TicketmasterApiService) as jasmine.SpyObj<TicketmasterApiService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearch', () => {
    it('should reset state and call loadEvents', fakeAsync(() => {
      // Setup: Create a delayed Observable instead of immediate response
      const delayedResponse = new Promise(resolve => 
        setTimeout(() => resolve(mockResponse), 100)
      );
      apiServiceSpy.searchEvents.and.returnValue(of(mockResponse).pipe(delay(100)));

      // Initial state
      component.events = [{ id: 'old-event' }];
      component.currentPage = 2;
      component.totalPages = 5;

      // Action
      component.onSearch();

      // Verify immediate reset
      expect(component.events).toEqual([]);
      expect(component.currentPage).toBe(0);
      expect(component.totalPages).toBe(0);
      
      // Wait for API response
      tick(100);
      
      // Verify final state after API response
      expect(component.events).toEqual(mockResponse._embedded.events);
    }));
  });

  describe('loadEvents', () => {
    it('should call API with correct parameters', () => {
      component.location = 'New York';
      component.startDate = '2024-03-20';
      component.endDate = '2024-03-21';
      component.keyword = 'concert';
      component.stateCode = 'NY';

      component.loadEvents();

      expect(apiServiceSpy.searchEvents).toHaveBeenCalledWith({
        location: 'New York',
        startDate: '2024-03-20',
        endDate: '2024-03-21',
        stateCode: 'NY',
        keyword: 'concert',
        classificationName: '',
        page: 0,
        size: 50
      });
    });

    it('should update events array with unique events', fakeAsync(() => {
      const existingEvent = { id: '1', name: 'Existing Event' };
      component.events = [existingEvent];
      
      component.loadEvents();
      tick();

      expect(component.events.length).toBe(2);
      expect(component.hasMoreEvents).toBeFalse();
      expect(component.isLoading).toBeFalse();
    }));

    it('should handle API errors', fakeAsync(() => {
      apiServiceSpy.searchEvents.and.returnValue(throwError(() => new Error('API Error')));
      spyOn(console, 'error');

      component.loadEvents();
      tick();

      expect(console.error).toHaveBeenCalledWith('Error fetching events:', jasmine.any(Error));
      expect(component.isLoading).toBeFalse();
    }));
  });

  describe('loadMore', () => {
    it('should increment page and load more events when available', () => {
      component.hasMoreEvents = true;
      component.isLoading = false;
      component.currentPage = 0;

      component.loadMore();

      expect(component.currentPage).toBe(1);
      expect(apiServiceSpy.searchEvents).toHaveBeenCalled();
    });

    it('should not load more events when already loading', () => {
      component.hasMoreEvents = true;
      component.isLoading = true;

      component.loadMore();

      expect(apiServiceSpy.searchEvents).not.toHaveBeenCalled();
    });

    it('should not load more events when no more events available', () => {
      component.hasMoreEvents = false;
      component.isLoading = false;

      component.loadMore();

      expect(apiServiceSpy.searchEvents).not.toHaveBeenCalled();
    });
  });
});
